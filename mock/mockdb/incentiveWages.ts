/**
 * @desc 奖惩工资表
 */
import { getQueryStringArgs, handleIsCreatTable } from '../utils/utils'

// 表名
const tableName = 'incentiveWages'

// 创建表
const handleCreatTable = (tableName: string, db: any) => {
  const create_table = `CREATE TABLE ${tableName}
		(
			id							INTEGER PRIMARY KEY AUTOINCREMENT,
			created_at 			TEXT DEFAULT (DATETIME('now', 'localtime')),
			dateTime				TEXT,
			userName				CHAR(50)           NOT NULL,
			userId					INTEGER,
			fullAttendance	REAL,
			foodAllowance		REAL,
			otherGrants			REAL,
			lateChargebacks	REAL,
			socialSecurity	REAL,
			otherChargebacks	REAL,
			totalAmount			REAL
		);`

  db.exec(create_table)
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

  // sql条件语句 userName LIKE ? AND ... AND ...
  let _stmt = ''
  // 传参 %${param['userName']}%
  let _param = []
  // 返回条件当前数据
  let data = []
  // 返回条件数据总数
  let total = 0

  // 时间和用户名
  if (!param['dateTimeStart'] && !param['dateTimeEnd'] && !param['userName']) {
    // 条件值都为空 则 查询全部并按id倒序返回
    data = db.prepare(`SELECT * FROM ${tableName} ORDER BY id DESC LIMIT ? OFFSET ?`).all(param['pageSize'], offset)
    // 返回所有数据
    total = db.prepare(`SELECT * FROM ${tableName}`).all().length
  } else {
    // 循环参数对象，判断是否有值，有值则挑出key
    const _stmtArr = []
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
    _stmt = _stmtArr.join(' AND ')

    // 都有值或者其中一个有值
    data = db
      .prepare(`SELECT * FROM ${tableName} WHERE ${_stmt} LIMIT ? OFFSET ?`)
      .all(..._param, param['pageSize'], offset)
    // 返回符合条件的所有数据
    total = db.prepare(`SELECT * FROM ${tableName} WHERE ${_stmt}`).all(..._param).length
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

// 修改更新记录
export const handleEdit = (data: any) => {
  // 处理修改字段，对象转成字符串拼接为sql语句
  let updateStr = ''
  let updateArr = []
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const element = data[key]
      if (key !== 'id' && key !== 'versionType') {
        updateArr.push(`${key}=@${key}`)
      }
    }
  }
  // updateStr: unitPrice=@unitPrice,productsName=@productsName,operationName=@operationName
  updateStr = updateArr.join(',')

  const db = handleIsCreatTable().db
  // 更新sql
  const updataStmt = db.prepare(`UPDATE ${tableName} SET ${updateStr} WHERE id=@id`)
  updataStmt.run(data)
  db.close()
  // 另外一个思路，根据id查出这条值，然后再用前端传入值覆盖，最后再执行sql语句
}

// 删除(支持批量)
export const handleDelete = (data: any) => {
  const db = handleIsCreatTable().db

  const deleteStmt = db.prepare(`DELETE FROM ${tableName} WHERE id = @id;`)
  // deleteStmt.run(data)

  //创建循环插入语句
  const deleteMany = db.transaction((dataArr: any) => {
    for (const item of dataArr) deleteStmt.run({ id: item })
  })
  // data = {ids: [1,2,3]}
  deleteMany(data.ids)

  db.close()
}

// 新增(支持批量)
export const handleAdd = (data: any) => {
  const db = handleIsCreatTable().db
  //创建插入语句
  const insertStmt = db.prepare(
    `INSERT INTO ${tableName} (${Object.keys(data[0]).join(',')}) VALUES (${Object.keys(data[0])
      .map(item => `@${item}`)
      .join(',')})`
  )
  // insert.run({ name: 'Jack', age: 2 })

  //创建循环插入语句
  const insertMany = db.transaction((data: any) => {
    for (const item of data) insertStmt.run(item)
  })
  insertMany(data)

  db.close()
}
