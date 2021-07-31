import { createRequire as CreateRequire } from 'module'
import { ForkedProcess } from '@virtualpatterns/mablung-worker'
import FileSystem from 'fs-extra'
import Path from 'path'

const Require = CreateRequire(import.meta.url)

class IndexProcess extends ForkedProcess {

  constructor(parameter = {}, option = {}) {
    super(Require.resolve('../../header/index.js'), parameter, option)

    let path = 'process/log/index-process.log'
    FileSystem.ensureDirSync(Path.dirname(path))

    this.writeTo(path)

  }

  whenExit() {

    return new Promise((resolve) => {

      let onExit = null

      this.on('exit', onExit = (code) => {

        this.off('exit', onExit)
        onExit = null

        resolve(code)

      })
  
    })

  }
  
}

export { IndexProcess }