export const BASE_PATH_MAP = Symbol('path_map')
export const ROUTER_MAP = Symbol('route_map')

// -----------------
// const express = require('express')
// const { createProxyMiddleware } = require('http-proxy-middleware')

// const app = express()

// const whiteList = ['http://allowed.com', 'http://anotherallowed.com']

// app.use('/api', (req, res, next) => {
//   const target = whiteList.includes(req.headers.host) ? req.headers.host : false

//   if (target) {
//     console.log(`Proxying request for ${target}`)
//     createProxyMiddleware({ target, changeOrigin: true })(req, res, next)
//   } else {
//     res.status(403).send('Forbidden')
//   }
// })

// app.listen(3000, () => {
//   console.log('Server listening on port 3000')
// })

// =============================== 请求ctx返回
// {
//   request: {
//     method: 'GET',
//     url: '/process/queryList?operationNumber=&productsName=&pageIndex=1&pageSize=50',
//     header: {
//       host: 'localhost:3300',
//       connection: 'keep-alive',
//       authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDIwLzEwL2lkZW50aXR5L2NsYWltcy9Vc2VyVHlwZSI6IjEiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDIwLzEwL2lkZW50aXR5L2NsYWltcy9Vc2VySWQiOiIzMDA1MTEiLCJuYmYiOjE3MTQzNTUzNzUsImV4cCI6MTg3MjAzNTM3NSwiaXNzIjoiWm93ZWUuU29mdCIsImF1ZCI6Ilpvd2VlLlNvZnQifQ.ese0L8RF9QTdp8gyB91h5BWt_aviWGE0F2AKiqIYN4k',
//       'user-agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1 wechatdevtools/1.06.2401020 MicroMessenger/8.0.5 webview/',
//       'content-type': 'application/json',
//       accept: '*/*',
//       'sec-fetch-site': 'cross-site',
//       'sec-fetch-mode': 'cors',
//       'sec-fetch-dest': 'empty',
//       referer: 'https://servicewechat.com/wx07cb3d1f3c2e0e1e/devtools/page-frame.html',
//       'accept-encoding': 'gzip, deflate, br'
//     }
//   },
//   response: {
//     status: 404,
//     message: 'Not Found',
//     header: [Object: null prototype] {
//       vary: 'Origin',
//       'access-control-allow-origin': '*'
//     }
//   },
//   app: { subdomainOffset: 2, proxy: false, env: 'development' },
//   originalUrl: '/process/queryList?operationNumber=&productsName=&pageIndex=1&pageSize=50',
//   req: '<original node req>',
//   res: '<original node res>',
//   socket: '<original node socket>'
// }
