/**
 * @desc 员工信息表
 */
import { getQueryStringArgs, handleIsCreatTable } from '../utils/utils'

// 表名
const tableName = 'userInfo'

// 创建表
const handleCreatTable = (tableName: string, db: any) => {
  const create_table = `CREATE TABLE ${tableName}
		(
			id							INTEGER PRIMARY KEY AUTOINCREMENT,
			created_at 			TEXT DEFAULT (DATETIME('now', 'localtime')),
			userName				CHAR(50)           NOT NULL,
			team						TEXT,
			cellPhone				INTEGER,
			bankAccount			INTEGER,
			bankAddress			TEXT,
			homeAddress			TEXT,
			baseSalary			REAL
		);`

  db.exec(create_table)
}

// 返回所有用户
export const handleSearchAll = () => {
  const db = handleIsCreatTable(tableName).db

  // 返回所有数据
  const totalData = db.prepare(`SELECT * FROM ${tableName}`).all()

  const returnObj = {
    ItemList: totalData,
  }

  db.close()
  return returnObj
}

// 查询字段+分页(判断是否有表，没有则创建)
export const handleSearchPage = (url: string) => {
  const db = handleIsCreatTable(tableName).db
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
  console.log('get参数转对象---', param)
  // 分页
  const offset = (param['pageIndex'] - 1) * param['pageSize']

  // sql条件语句
  let _stmt = 'userName LIKE ?'
  // 传参
  let _param = [`%${param['userName']}%`]
  // 返回条件当前数据
  let data = []
  // 返回条件数据总数
  let total = 0

  if (!param['userName']) {
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

  // 查询sql -- 条件
  // const selectStmt = db.prepare(`SELECT * FROM ${tableName} WHERE ${_stmt} LIMIT ? OFFSET ?`)
  // // 返回找到的所有 模糊匹配：`%${searchTerm}%`
  // let data = selectStmt.all(`%${param['userName']}%`, param['pageSize'], offset)
  // console.log('data----', data)

  // // 查询sql -- 所有
  // const selectAllStmt = db.prepare(`SELECT * FROM ${tableName}`)
  // // 返回所有数据
  // let dataAll = selectAllStmt.all()

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
  updateStr = updateArr.join(',')
  // unitPrice=@unitPrice,productsName=@productsName,operationName=@operationName
  // 另外一个思路，根据id查出这条值，然后再用前端传入值覆盖，最后再执行sql语句

  const db = handleIsCreatTable(tableName).db
  // 更新sql
  const updataStmt = db.prepare(`UPDATE ${tableName} SET ${updateStr} WHERE id=@id`)
  updataStmt.run(data)

  db.close()
}

// 删除(支持批量)
export const handleDelete = (data: any) => {
  const db = handleIsCreatTable(tableName).db

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
  const db = handleIsCreatTable(tableName).db
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
