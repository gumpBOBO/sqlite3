import { prefix, get, post } from '../requestDecorator'
import { handleSearchPage, handleEdit, handleAdd, handleDelete, handleSearchAll } from '../mockdb/process'
@prefix('/process')
export default class GoodsClass {
  // 定义查询
  @get('/queryList')
  // 接口返回
  async queryList(ctx: any) {
    // ctx.request.url(get參數)
    return handleSearchPage(ctx.request.url)
  }

  // 定义添加
  @post('/addItem')
  // 接口返回
  async addItem(ctx: any) {
    // ctx.request.body(post參數)
    return handleAdd(ctx.request.body)
  }

  // 定义修改
  @post('/updateItem')
  // 接口返回
  async updateItem(ctx: any) {
    // ctx.request.body(post參數)
    return handleEdit(ctx.request.body)
  }

  // 定义删除
  @post('/deleteItem')
  // 接口返回
  async deleteItem(ctx: any) {
    // ctx.request.body(post參數)
    return handleDelete(ctx.request.body)
  }

  // 查询全部
  @get('/queryAll')
  // 接口返回
  async queryAll() {
    return handleSearchAll()
  }
}
