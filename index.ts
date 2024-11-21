// 主入口
import Koa, { Context } from 'koa'
import koaBody from 'koa-body'
import koaRouter from 'koa-router'
import chalk from 'chalk'
import cors from 'koa2-cors'

import logger from 'koa-logger'
import log4js from 'log4js'

import addRouter from './router'
import { ResultHandler } from './middleware/resultHandler'

const app = new Koa()
// 跨域
app.use(cors())
const router = new koaRouter()

// 接口 3300
const port = 3008
const log4 = log4js.getLogger()
log4.level = 'debug'

//日志打印
app.use(
  logger(info => {
    log4.debug(info)
  })
)

app.use(koaBody())

app.use(async (ctx, next) => {
  // console.log('koa2----', ctx)
  // 判断请求参数中的地址是否在白名单中，如果不在则返回错误

  await next()
  // log4.debug(chalk.green('请求路径:  ') + ctx.request.url);
  log4.debug(chalk.blue('请求body:  ') + JSON.stringify(ctx.request.body))
  log4.debug(chalk.blue('返回数据:  ') + JSON.stringify(ctx.body))
})

app.use(ResultHandler())
//加载路由
addRouter(router)
//启动路由
app.use(router.routes()).use(router.allowedMethods())

app.use(async (ctx: Context) => {
  log4.error(`404 ${ctx.message} : ${ctx.href}`)
  ctx.status = 404
  ctx.body = '404! api not found !'
})

// koa already had middleware to deal with the error, just register the error event
// 注册错误事件
app.on('error', (err, ctx: Context) => {
  log4.error(err) //log all errors
  ctx.status = 500
  if (ctx.app.env !== 'development') {
    //throw the error to frontEnd when in the develop mode
    ctx.res.end(err.stack) //finish the response
  }
})

app.listen(port, () => {
  console.log(`${port}项目启动`)
  log4.debug('mock server running at: http://localhost:%d', port)
})

export default app
