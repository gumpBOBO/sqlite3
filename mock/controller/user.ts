// 导入装饰器
import { post, prefix, get } from '../requestDecorator'
// mock数据
import userList from '../mockdb/userList'
// koa库
import * as Koa from 'koa'
// 传入定义的路径前缀
@prefix('/user')
export default class User {
  // 登录接口
  @post('/login')
  async login(ctx: any) {
    const { username } = ctx.request.body
    // 循环数组 userList
    for (const user of userList) {
      // 如果存在用户则返回token
      if (user.username === username) {
        return {
          accessToken: username + '-token',
        }
      }
    }
    // 找不到则抛出401
    return ctx.throw(401)
  }

  // 获取用户信息  Koa Context 将 node 的 request 和 response 对象封装在一个单独的对象里面
  @get('/userInfo')
  async getUserInfo(ctx: Koa.Context) {
    // 获取request.header中的token
    const token = ctx.request.header.token
    console.log('userInfo-----token', token)
    return token === 'admin-token' ? userList[0] : userList[1]
  }

  // 查找用户
  @get('/getUsers')
  async getUsers(ctx: any) {
    // ctx.query 查询条件
    const { name } = ctx.query
    // 循环userlist
    const users = userList.filter(user => {
      // user的名称 => 小写
      const lowerCaseName = user.name.toLowerCase()
      // 根据传入的条件里的name再用户名中匹配
      return !(name && lowerCaseName.indexOf((name as string).toLowerCase()) < 0)
    })
    return {
      code: 20000,
      data: {
        items: users,
      },
    }
  }
}
