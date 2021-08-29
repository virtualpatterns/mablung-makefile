import { createRequire as CreateRequire } from 'module'
import { ForkedProcess } from '@virtualpatterns/mablung-worker'

const Require = CreateRequire(import.meta.url)

class IndexProcess extends ForkedProcess {

  constructor(logPath, parameter = {}, option = {}) {
    super(Require.resolve('../../command/index.js'), parameter, option)
    this.writeTo(logPath)
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