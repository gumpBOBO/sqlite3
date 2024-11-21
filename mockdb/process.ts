/**
 * @desc 工序设置表
 */
import { getQueryStringArgs, handleIsCreatTable } from '../utils/utils'
// 表名
const tableName = 'process'

// 创建表
const handleCreatTable = (tableName: string, db: any) => {
  const create_table = `CREATE TABLE ${tableName}
		(
			id							INTEGER PRIMARY KEY AUTOINCREMENT,
			operationNumber	CHAR(50)           NOT NULL,
			unitPrice				REAL,
			productsName		TEXT,
			operationName		TEXT,
			created_at 			TEXT DEFAULT (DATETIME('now', 'localtime'))
		);`

  db.exec(create_table)
}

// 返回所有工序
export const handleSearchAll = () => {
  const db = handleIsCreatTable().db

  // 返回所有数据
  const totalData = db.prepare(`SELECT * FROM ${tableName}`).all()

  const returnObj = {
    ItemList: totalData,
  }

  db.close()
  return returnObj
}

// 模糊查询多字段+分页(判断是否有表，没有则创建)
export const handleSearchPage = (url: string) => {
  const db = handleIsCreatTable().db
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
  // name=cats&ID=12345&pagesize=10&pageIndex=1 ==> { name: 'Jack', id: 1, pagesize:10, pageIndex: 1 }
  const param = getQueryStringArgs(url)
  console.log('get参数转对象---', param)
  // 分页
  const offset = (param['pageIndex'] - 1) * param['pageSize']

  // sql条件语句
  let _stmt = ''
  // 传参
  let _param = []
  // 返回条件当前数据
  let data = []
  // 返回条件数据总数
  let total = 0

  if (param['operationNumber'] && param['productsName']) {
    // 如果都有值
    _stmt = 'operationNumber LIKE ? AND productsName LIKE ?'
    _param = [`%${param['operationNumber']}%`, `%${param['productsName']}%`]
  } else if (!param['operationNumber'] && param['productsName']) {
    // 如果其中一个没有值
    _stmt = 'productsName LIKE ?'
    _param = [`%${param['productsName']}%`]
  } else if (param['operationNumber'] && !param['productsName']) {
    _stmt = 'operationNumber LIKE ?'
    _param = [`%${param['operationNumber']}%`]
  } else {
    // 如果都没值
  }

  if (!param['operationNumber'] && !param['productsName']) {
    // 条件值都为空 则 查询全部并按id倒序
    data = db.prepare(`SELECT * FROM ${tableName} ORDER BY id DESC LIMIT ? OFFSET ?`).all(param['pageSize'], offset)
    // 返回所有数据
    total = db.prepare(`SELECT * FROM ${tableName}`).all().length
  } else {
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
  let updateArr = []
  let updateStr = ''
  const returnObj = {}
  // 修改失败标识
  let isError = true

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const element = data[key]
      if (key !== 'id' && key !== 'versionType') {
        updateArr.push(`${key}=@${key}`)
      }
    }
  }
  updateStr = updateArr.join(',')
  console.log('更新---', updateStr, updateStr.indexOf('operationNumber'))

  const db = handleIsCreatTable().db

  // 检查 updateArr 中是否包含 operationNumber, 有则先去查询是否存在，存在则抛出错误
  if (updateStr.indexOf('operationNumber') > -1) {
    const selectStmt = db.prepare(`SELECT * FROM ${tableName}  WHERE operationNumber = ?`)
    // 只会返回找到的第一条（结果是对象，非数组，找不到则是 undefined）
    let _item = selectStmt.get(data['operationNumber'])
    if (_item) {
      // 有则返回错误标识的 obj
      returnObj['code'] = 600
      returnObj['msg'] = '工序编号重复'
      isError = false
    }
  }

  if (!isError) {
    db.close()
  } else {
    // 更新sql
    const updataStmt = db.prepare(
      // eg: updateStr: unitPrice=@unitPrice,productsName=@productsName,operationName=@operationName
      `UPDATE ${tableName} SET ${updateStr} WHERE id=@id`
    )

    // eg: data = { id: 1, name: 'Tom', age: 3 }
    updataStmt.run(data)
    // 另外一个思路，根据id查出这条值，然后再用前端传入值覆盖，最后再执行sql语句
    db.close()
  }

  return returnObj
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
  // eg: data = { ids: [1,2,3] }
  deleteMany(data.ids)

  db.close()
}

// 新增(支持批量) data = [{},{}]
export const handleAdd = (data: any) => {
  console.log('add----', data)
  const db = handleIsCreatTable().db

  //创建插入语句
  const insertStmt = db.prepare(
    `INSERT INTO ${tableName} (operationNumber, productsName, operationName, unitPrice) VALUES (@operationNumber, @productsName, @operationName, @unitPrice)`
  )
  // insert.run({ name: 'Jack', age: 2 })

  //创建循环插入语句
  const insertMany = db.transaction((data: any) => {
    for (const item of data) insertStmt.run(item)
  })
  // eg: data = [{operationNumber,productsName,operationName,unitPrice }]
  insertMany(data)

  db.close()
}
