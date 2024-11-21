import { Context, Next } from 'koa'

// type PlainObject = { [P: string]: any };
type PlainObject = Record<string, any>
type ParamObject = Record<string, any>
type MysqlResult = {
  affectedRows?: number
  insertId?: string
}

type PathMeta = {
  name: string
  path: string
}

type RouteMeta = {
  name: string
  method: string
  path: string
  isVerify: boolean
}

//  = 一个函数（这个函数是() => promise）
type MiddleWare = (...arg: any[]) => (ctx: Context, next?: Next) => Promise<void>

export { MysqlResult, PlainObject, RouteMeta, MiddleWare, PathMeta, ParamObject }
