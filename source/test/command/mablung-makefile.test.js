import Test from 'ava'

import { MablungMakefileProcess } from './mablung-makefile-process.js'

Test('mablung-makefile get-path', async (test) => {
  let process = new MablungMakefileProcess({ 'get-path': true })
  test.is(await process.whenExit(), 0)
})

Test('mablung-makefile get-upgrade', async (test) => {
  let process = new MablungMakefileProcess({ 'get-upgrade': true })
  test.is(await process.whenExit(), 0)
})
