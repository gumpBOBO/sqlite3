import log from '../utils/logger'
import { MiddleWare } from '../type'

// 返回结果json的申明
export type ResultInfo = {
  Code: number
  Msg?: string
  Data?: any
  token?: string
  message?: string
  err?: any
}

/**
 * 执行结果 handler 用来给每个响应对象包装响应码等
 */
export const ResultHandler: MiddleWare = () => async (ctx, next) => {
  const r: ResultInfo = { Code: 200 }
  try {
    const data: any = await next()
    r.Code = 200
    r.Msg = 'success'
    r.Data = data || null
    // 判断 data 再做进一步处理，例如抛出 204 等前后端互相约定的 code
    if (data?.code) {
      r.Code = data.code
      r.Msg = data.msg
    }
  } catch (err) {
    log.error(err)
    log.error('xxx' + err.statusCode)

    // 系统的状态code
    r.Code = err.statusCode
    switch (err.statusCode) {
      case 102:
        r.Msg = '用户不存在'
        break

      default:
        break
    }
  }
  ctx.body = r
}
