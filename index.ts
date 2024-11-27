import app from './api/index'
import log4js from 'log4js'

const log4 = log4js.getLogger()
// 接口 3300
const port = 3008

app.listen(port, () => {
  console.log(`${port}项目启动`)
  log4.debug('mock server running at: http://localhost:%d', port)
})

export default app
