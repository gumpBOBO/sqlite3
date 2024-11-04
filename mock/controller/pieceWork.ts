import { prefix, get, post } from '../requestDecorator'
import { handleSearchPage, handleEdit, handleAdd, handleDelete } from '../mockdb/pieceWork'
@prefix('/pieceWork')
export default class GoodsClass {
  // 查询
  @get('/queryList')
  // 接口返回
  async queryList(ctx: any) {
    // ctx.request.url(get參數)
    return handleSearchPage(ctx.request.url)
  }

  // 添加
  @post('/addItem')
  // 接口返回
  async addItem(ctx: any) {
    // ctx.request.body(post參數)
    return handleAdd(ctx.request.body)
  }

  // 修改
  @post('/updateItem')
  // 接口返回
  async updateItem(ctx: any) {
    // ctx.request.body(post參數)
    return handleEdit(ctx.request.body)
  }

  // 删除
  @post('/deleteItem')
  // 接口返回
  async deleteItem(ctx: any) {
    // ctx.request.body(post參數)
    return handleDelete(ctx.request.body)
  }
}
