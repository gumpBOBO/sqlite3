/**
 * @desc 工资汇总
 */
import { getQueryStringArgs, handleIsCreatTable } from '../utils/utils'
import BigNumber from 'bignumber.js'

// 表名
const tableName = 'payrollSummary'

// 创建表
const handleCreatTable = (tableName: string, db: any) => {
  // 计件表，计时表，奖惩表 3个表，根据人查出来，eg:  计件表查出这个人这段时间一共多少钱  计时表这个人这段时间一共多少钱  奖惩表这个人这段时间一共多少钱
  // pieceTotalAmount timeTotalAmount 奖惩表字段
  const create_table = `CREATE TABLE ${tableName}
		(
			id							INTEGER PRIMARY KEY AUTOINCREMENT,
			created_at 			TEXT DEFAULT (DATETIME('now', 'localtime')),
			userName				CHAR(50)           NOT NULL,
			userId					INTEGER,
			fullAttendance	REAL,
			foodAllowance		REAL,
			otherGrants			REAL,
			lateChargebacks	REAL,
			socialSecurity	REAL,
			otherChargebacks	REAL,
			totalAmount			REAL,
			pieceTotalAmount	REAL,
			timeTotalAmount	REAL,
			allTotalAmount	REAL
		);`

  db.exec(create_table)
}

// 按月获取计件表数据
const handleGetPieceData = (db, _stmt, _param) => {
  // 计件表数据
  let pieceData = []
  let pieceTotalArr = []

  // 查询计件表 按月查询所有数据, 然后根据用户id 累加出总工资
  pieceData = db.prepare(`SELECT * FROM pieceWork WHERE ${_stmt}`).all(..._param)

  // 定义个新数组，如果id有相同则累加total，没有则push进去
  for (let index = 0; index < pieceData.length; index++) {
    const element = pieceData[index]
    // 如果新数组中找到当前用户则累加total
    const _item: any = pieceTotalArr.find(item => item.userId === element.userId)
    if (_item) {
      _item.totalAmount = Number(
        new BigNumber((_item.totalAmount += element.totalAmount)).decimalPlaces(2, BigNumber.ROUND_DOWN)
      )
    } else {
      pieceTotalArr.push(element)
    }
  }

  return pieceTotalArr
}

// 按月获取计时表数据
const handleGetTimeData = (db, _stmt, _param) => {
  // 计时表数据
  let timeData = []
  // 合并用户后累加的数据
  let timeTotalArr = []

  // 查询计时表 按月查询所有数据, 然后根据用户id 累加出总工资
  timeData = db.prepare(`SELECT * FROM timeWork WHERE ${_stmt}`).all(..._param)

  // 定义个新数组，如果id有相同则累加total，没有则push进去
  for (let index = 0; index < timeData.length; index++) {
    const element = timeData[index]
    // 如果新数组中找到当前用户则累加total
    const _item: any = timeTotalArr.find(item => item.userId === element.userId)
    if (_item) {
      _item.totalAmount = Number(
        new BigNumber((_item.totalAmount += element.totalAmount)).decimalPlaces(2, BigNumber.ROUND_DOWN)
      )
    } else {
      timeTotalArr.push(element)
    }
  }
  return timeTotalArr
}

// 按月获取奖罚表数据
const handleGetIncentiveWages = (db, _stmt, _param) => {
  // 奖罚表数据
  let incentiveWagesData = []
  let incentiveWagesTotalArr = []

  // 查询计时表 按月查询所有数据, 然后根据用户id 累加出总工资
  incentiveWagesData = db.prepare(`SELECT * FROM incentiveWages WHERE ${_stmt}`).all(..._param)

  // 定义个新数组，如果用户id有相同则累加total，没有则push进去
  for (let index = 0; index < incentiveWagesData.length; index++) {
    const element = incentiveWagesData[index]

    // 如果新数组中找到当前用户则累加total
    const _item: any = incentiveWagesTotalArr.find(item => item.userId === element.userId)
    if (_item) {
      // 合计金额 totalAmount 全勤奖 fullAttendance 伙食补助 foodAllowance 其他补助 otherGrants 迟到早退扣款 lateChargebacks 社保扣款 socialSecurity 其他扣款 otherChargebacks
      const dataIndexArr = [
        'totalAmount',
        'fullAttendance',
        'foodAllowance',
        'otherGrants',
        'lateChargebacks',
        'socialSecurity',
        'otherChargebacks',
      ]
      dataIndexArr.forEach(key => {
        _item[key] = Number(new BigNumber((_item[key] += element[key])).decimalPlaces(2, BigNumber.ROUND_DOWN))
      })
    } else {
      incentiveWagesTotalArr.push(element)
    }
  }
  return incentiveWagesTotalArr
}

// 获取全部员工并判断是否存在汇总表中执行批量添加
const handleGetAlluser = db => {
  // 返回所有员工数据
  const allUser = db.prepare(`SELECT * FROM userInfo`).all()

  return allUser.map(item => {
    return {
      userId: item.id,
      userName: item.userName,
      fullAttendance: 0,
      foodAllowance: 0,
      otherGrants: 0,
      lateChargebacks: 0,
      socialSecurity: 0,
      otherChargebacks: 0,
      totalAmount: 0,
    }
  })
}

// 把接口参数转成sql语句所需格式
const handleSetParam = (param: any) => {
  // 循环参数对象, 判断是否有值, 有值则挑出key
  const _stmtArr = []
  const _param = []
  for (const key in param) {
    if (Object.prototype.hasOwnProperty.call(param, key)) {
      const element = param[key]

      // 有值并且排除分页参数 日期是个数组 要判断区间
      if (element && !['pageIndex', 'pageSize'].includes(key)) {
        if (key === 'dateTimeStart') {
          _stmtArr.push(`dateTime BETWEEN ? AND ?`)
          _param.push(`${element}`)
        } else if (key === 'dateTimeEnd') {
          _param.push(`${element}`)
        } else {
          _stmtArr.push(`${key} LIKE ?`)
          _param.push(`%${element}%`)
        }
      }
    }
  }

  return { _stmtArr, _param }
}

// 查询字段+分页(判断是否有表，没有则创建)
export const handleSearchPage = (url: string) => {
  const db = handleIsCreatTable().db
  // 删除表
  // db.exec(`DROP TABLE ${tableName}`)

  // 检查是否创建表
  if (handleIsCreatTable(tableName).isCreat) {
    console.log(`表 ${tableName} 已存在。`)
  } else {
    console.log(`表 ${tableName} 不存在。`)
    // 执行创建表
    handleCreatTable(tableName, db)
  }

  // get 获取参数转成数组后再按等号拆成对象值
  const param = getQueryStringArgs(url)
  // 分页
  const offset = (param['pageIndex'] - 1) * param['pageSize']

  // sql条件语句 eg: userName LIKE ? AND ... AND ...
  let _stmt = ''
  // 传参 eg: %${param['userName']}%
  let _param = []
  // 返回条件当前数据
  let data = []
  // 返回条件数据总数
  let total = 0

  // 计件表数据
  let pieceTotalArr = []
  // 计时表数据
  let timeTotalArr = []
  // 奖罚表数据
  let incentiveWagesTotalArr = []
  // 用户表
  let userInfoArr = []

  // 按月份查询时间
  if (!param['dateTimeStart'] && !param['dateTimeEnd']) {
    // 如果时间为空(默认查当月即不会为空)
  } else {
    // 把月份转成天格式 dateTimeStart: '2024/04', dateTimeEnd: '2024/04',
    param['dateTimeStart'] = `${param['dateTimeStart']}/01`
    param['dateTimeEnd'] = `${param['dateTimeEnd']}/31`
    _stmt = handleSetParam(param)._stmtArr.join(' AND ')
    _param = handleSetParam(param)['_param']

    // 计件
    pieceTotalArr = handleGetPieceData(db, _stmt, _param)
    // 计时
    timeTotalArr = handleGetTimeData(db, _stmt, _param)
    // 奖惩
    incentiveWagesTotalArr = handleGetIncentiveWages(db, _stmt, _param)
    // 员工
    userInfoArr = handleGetAlluser(db)

    // 根据用户表批量添加员工到工资汇总表，然后以员工userId为标识填充其他3表数据
    userInfoArr.forEach(element => {
      // 如果奖惩数据中找到当前计件用户则赋值
      const _itemincentiveWages: any = incentiveWagesTotalArr.find(item => item.userId === element.userId)
      if (_itemincentiveWages) {
        element = Object.assign(element, _itemincentiveWages)
      } else {
        // 没有匹配的则默认值都为0
      }

      // 如果计件数据中找到当前计件用户则累加计件合计
      const _itemPiece: any = pieceTotalArr.find(item => item.userId === element.userId)
      if (_itemPiece) {
        element['pieceTotalAmount'] = _itemPiece.totalAmount
      } else {
        // 没有找到
        element['pieceTotalAmount'] = 0
      }

      // 如果计时中找到当前计时用户则累加计时合计
      const _itemTime: any = timeTotalArr.find(item => item.userId === element.userId)
      if (_itemPiece) {
        element['timeTotalAmount'] = _itemTime.totalAmount
      } else {
        // 没有找到
        element['timeTotalAmount'] = 0
      }

      // 最后计算3表总合计
      element['allTotalAmount'] = Number(
        new BigNumber(element.totalAmount + element.pieceTotalAmount + element.timeTotalAmount).decimalPlaces(
          2,
          BigNumber.ROUND_DOWN
        )
      )
    })

    // 如果 userName 不为空，则要执行筛选
    if (param['userName']) {
      data = userInfoArr.filter(item => item.userName === param['userName'])
    } else {
      data = userInfoArr
    }

    total = data.length
  }

  const returnObj = {
    ItemList: data,
    PageSize: Number(param['pageSize']),
    PageIndex: Number(param['pageIndex']),
    TotalCount: total,
  }

  db.close()
  return returnObj
}
