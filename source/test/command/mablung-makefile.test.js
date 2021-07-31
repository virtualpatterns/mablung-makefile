import Test from 'ava'

import { MablungMakefileProcess } from './mablung-makefile-process.js'

Test('(default)', async (test) => {
  let process = new MablungMakefileProcess()
  test.is(await process.whenExit(), 1)
})

Test('get-path', async (test) => {
  let process = new MablungMakefileProcess({ 'get-path': true })
  test.is(await process.whenExit(), 0)
})

Test('get-version', async (test) => {
  let process = new MablungMakefileProcess({ 'get-version': true })
  test.is(await process.whenExit(), 0)
})

// Test('get-update', async (test) => {
//   let process = new MablungMakefileProcess({ 'get-update': true })
//   test.is(await process.whenExit(), 0)
// })
