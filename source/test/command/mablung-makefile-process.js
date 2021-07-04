import { createRequire as CreateRequire } from 'module'
import FileSystem from 'fs-extra'
import { ForkedProcess } from '@virtualpatterns/mablung-worker'
import Path from 'path'

const Require = CreateRequire(import.meta.url)

class MablungMakefileProcess extends ForkedProcess {

  constructor(parameter = {}, option = {}) {
    super(Require.resolve('../../command/mablung-makefile.js'), parameter, option)

    let path = 'process/log/mablung-makefile-process.log'
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

export { MablungMakefileProcess }