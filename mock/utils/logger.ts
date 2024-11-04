import log4js from 'log4js'

const log = log4js.getLogger('default')
// 导出错误Log
export const errlog = log4js.getLogger('err')
export default log
