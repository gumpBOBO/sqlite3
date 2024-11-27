// 主入口
import Koa, { Context } from 'koa'
import koaBody from 'koa-body'
import koaRouter from 'koa-router'
import chalk from 'chalk'
import cors from 'koa2-cors'

import logger from 'koa-logger'
import log4js from 'log4js'

import addRouter from './controller/router'
import { ResultHandler } from './middleware/resultHandler'

const app: any = new Koa()
const router = new koaRouter()

const log4 = log4js.getLogger()
log4.level = 'debug'

// 跨域
app.use(cors())
app.use(koaBody())
//启动路由
app.use(router.routes()).use(router.allowedMethods())

//加载路由
addRouter(router)

//日志打印
app.use(
  logger(info => {
    log4.debug(info)
  })
)

app.use(ResultHandler())

app.use(async (ctx, next) => {
  // console.log('koa2----', ctx)
  // 判断请求参数中的地址是否在白名单中，如果不在则返回错误

  await next()
  // log4.debug(chalk.green('请求路径:  ') + ctx.request.url);
  log4.debug(chalk.blue('请求body:  ') + JSON.stringify(ctx.request.body))
  log4.debug(chalk.blue('返回数据:  ') + JSON.stringify(ctx.body))
})

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

export default app

// =========================================================================================
// import Koa, { Context } from 'koa'
// import bodyParser from 'koa-body'
// import Router from 'koa-router'
// // import chalk from 'chalk'
// import cors from 'koa2-cors'

// // require('dotenv').config()
// // const Koa = require('koa')
// // const axios = require('axios')
// // const Router = require('@koa/router')
// // const cors = require('@koa/cors')
// // const bodyParser = require('koa-bodyparser')
// // const { Configuration, OpenAIApi } = require('openai');
// // const { PassThrough } = require('stream')

// const app = new Koa()
// const router = new Router()
// // process.env.PORT ||
// const port = 4000

// // const configuration = new Configuration({
// //   apiKey: process.env.OPENAI_API_KEY
// // });

// app.use(cors())
// app.use(bodyParser())
// app.use(router.routes())
// app.use(router.allowedMethods())

// router.get('/hello', async ctx => {
//   const { what } = ctx.query

//   ctx.body = {
//     message: `Hello ${what || 'World'}`,
//   }
//   ctx.status = 200
// })

// // router.post('/message', async ctx => {
// //   console.log(ctx.request.body)
// //   const { messages } = ctx.request.body;
// //   const openai = new OpenAIApi(configuration);
// //   const response = await openai.createChatCompletion({
// //     model: 'gpt-3.5-turbo',
// //     messages: messages,
// //     max_tokens: 4000,
// //     temperature: 0.9,
// //     // 是否以流的方式输出给客户端
// //     // stream: true,
// //   });

// //   ctx.body = {
// //     message: response.data
// //   };
// //   ctx.status = 200;
// // });

// router.post('/message', async ctx => {
//   const { messages } = ctx.request.body

//   try {
//     // const response = await axios.post(
//     //   process.env.OPENAI_URL,
//     //   {
//     //     model: 'gpt-3.5-turbo',
//     //     messages: messages,
//     //     max_tokens: 4000,
//     //     temperature: 0.9,
//     //   },
//     //   {
//     //     headers: {
//     //       Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//     //     },
//     //   }
//     // )

//     ctx.body = {
//       message: { code: 200, data: '1111' },
//     }
//   } catch (error) {
//     ctx.status = 500
//     ctx.body = { error: error.message }
//   }
// })

// // 客户端使用@microsoft/fetch-event-source来请求及接收数据
// // router.post('/chat', ctx => {
// //   const { messages } = ctx.request.body
// //   ctx.set({
// //     'Access-Control-Allow-Origin': '*',
// //     'Content-Type': 'text/event-stream',
// //     'Cache-Control': 'no-cache',
// //     Connection: 'keep-alive',
// //   })
// //   const sseStream = new PassThrough()
// //   ctx.body = sseStream
// //   console.log(messages)

// //   const content = messages?.[0]?.content || '你未输入内容'

// //   let step = 0
// //   // 定时器依次返回message
// //   const time = setInterval(() => {
// //     const data = { message: content[step++] }
// //     // 每个消息以 \n\n分割
// //     sseStream.write(`data: ${JSON.stringify(data)}\n\n`)
// //     if (step > content.length - 1) {
// //       sseStream.end()
// //       clearInterval(time)
// //     }
// //   }, 600)
// // })

// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`)
// })

// export default app
