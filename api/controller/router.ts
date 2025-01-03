/* eslint-disable @typescript-eslint/no-var-requires */

import 'reflect-metadata'
import fs from 'fs'
import path from 'path'
import { ROUTER_MAP, BASE_PATH_MAP } from '../constant'
import { RouteMeta, PathMeta } from '../../type'
import Router from 'koa-router'

const addRouter = (router: Router) => {
  // 读取controller文件夹，获取文件 __dirname
  // const ctrPath = path.join(process.cwd(), './controller')
  const ctrPath = path.join(__dirname)
  console.log('path---------', ctrPath)
  const modules: ObjectConstructor[] = []
  // 扫描controller文件夹，收集所有controller
  fs.readdirSync(ctrPath).forEach(name => {
    if (/^[^.]+\.(t|j)s$/.test(name)) {
      modules.push(require(path.join(ctrPath, name)).default)
    }
  })

  // 结合meta数据添加路由 和 验证
  modules.forEach(m => {
    const routerMap: RouteMeta[] = Reflect.getMetadata(ROUTER_MAP, m, 'method') || []
    const basePathMap: PathMeta[] = Reflect.getMetadata(BASE_PATH_MAP, m) || []
    const basePath: PathMeta = basePathMap.pop()
    if (routerMap.length) {
      const ctr = new m()
      routerMap.forEach(route => {
        // const {name, method, path, isVerify} = route;
        const { name, method, path } = route
        const newPath: string = basePath ? basePath.path + path : path
        console.log('newPath----', newPath)
        console.log('name----', name)
        // router[method](newPath, jwt(newPath, isVerify), ctr[name]);
        router[method](newPath, ctr[name])
      })
    }
  })
}

export default addRouter
