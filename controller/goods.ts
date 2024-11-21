import { prefix, get, post } from '../requestDecorator'
import handleGoods from '../mockdb/goods'
import { handleAdd } from '../mockdb/goods'
@prefix('/goods')
export default class GoodsClass {
  // 查询
  @get('/goodsList')
  // 接口返回
  async goodsList(ctx: any) {
    // ctx.request.body(post參數) ctx.request.url(get參數)
    return handleGoods(ctx.request.url, ctx.request.body)
  }
  // 添加
  @post('/addGoods')
  // 接口返回
  async addGoods(ctx: any) {
    // ctx.request.body(post參數) ctx.request.url(get參數)
    return handleAdd(ctx.request.url, ctx.request.body)
  }
}

/* 
  request: {
    method: 'GET',
		//  url: '/goods/goodsList?ID=12345',
    url: '/goods/goodsList',
    header: {
      host: 'localhost:3300',
      connection: 'keep-alive',
      pragma: 'no-cache',
      'cache-control': 'no-cache',
      'sec-ch-ua': '"Chromium";v="122", "Not(A:Brand";v="24", "Microsoft Edge";v="122"',
      accept: 'application/json, text/plain, *\/*',
      'sec-ch-ua-mobile': '?0',
      authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoi6LaF57qn566h55CG5ZGYIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZWlkZW50aWZpZXIiOiJhZG1pbjAwMSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMjAvMTAvaWRlbnRpdHkvY2xhaW1zL1VzZXJUeXBlIjoiMCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMjAvMTAvaWRlbnRpdHkvY2xhaW1zL1VzZXJJZCI6Ii0xIiwibmJmIjoxNzA5Nzc3Mjc4LCJleHAiOjE4Njc0NTcyNzgsImlzcyI6Ilpvd2VlLlNvZnQiLCJhdWQiOiJab3dlZS5Tb2Z0In0.ia3WwbUvsmDt4uytEF55a_6MjKkTDtL50x5nGx9mzqQ',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36 Edg/122.0.0.0',
      'sec-ch-ua-platform': '"Windows"',
      origin: 'http://localhost:50008',
      'sec-fetch-site': 'same-site',
      'sec-fetch-mode': 'cors',
      'sec-fetch-dest': 'empty',
      referer: 'http://localhost:50008/',
      'accept-encoding': 'gzip, deflate, br',
      'accept-language': 'zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6'
    }
  },
  response: {
    status: 404,
    message: 'Not Found',
    header: [Object: null prototype] {
      vary: 'Origin',
      'access-control-allow-origin': 'http://localhost:50008'
    }
  },
  app: { subdomainOffset: 2, proxy: false, env: 'development' },
  originalUrl: '/goods/goodsList',
  req: '<original node req>',
  res: '<original node res>',
  socket: '<original node socket>'
}
*/
