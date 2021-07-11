import Test from 'ava'

import { MablungMakefileProcess } from './mablung-makefile-process.js'

Test('mablung-makefile get-path', async (test) => {
  let process = new MablungMakefileProcess({ 'get-path': true })
  test.is(await process.whenExit(), 0)
})

Test('mablung-makefile get-update', async (test) => {
  let process = new MablungMakefileProcess({ 'get-update': true })
  test.is(await process.whenExit(), 0)
})
