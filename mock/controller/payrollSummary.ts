import { prefix, get, post } from '../requestDecorator'
import { handleSearchPage } from '../mockdb/payrollSummary'
@prefix('/payrollSummary')
export default class GoodsClass {
  // 查询
  @get('/queryList')
  // 接口返回
  async queryList(ctx: any) {
    // ctx.request.url(get參數)
    return handleSearchPage(ctx.request.url)
  }
}
