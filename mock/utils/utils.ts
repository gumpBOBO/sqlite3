// 获取url参数转成对象
export const getQueryStringArgs = (url: string) => {
  const qs = url.split('?')[1] //location.search.length ? location.search.substring(1) : ''
  const args = {}
  const items = qs.length ? qs.split('&') : []
  let item = null
  let name = null
  let value = null
  items.forEach(sreachItem => {
    item = sreachItem.split('=')
    name = decodeURIComponent(item[0])
    value = decodeURIComponent(item[1])
    if (name.length) {
      args[name] = value
    }
  })
  return args
}

// 判断是否创建表
export const handleIsCreatTable = (tableName?: string) => {
  // const Database = require('better-sqlite3')
  // const db = new Database('path/to/database.db')
  // 连接数据库
  const db = require('better-sqlite3')('../database.db', { verbose: console.log })

  // 检查表是否存在
  const exists = tableName
    ? db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`).get(tableName)
    : false

  // 关闭数据库连接
  // db.close()

  return { isCreat: !!exists, db: db }
}
