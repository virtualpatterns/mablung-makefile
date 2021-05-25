import { createRequire as CreateRequire } from 'module'
import Test from 'ava'

const Process = process
const Require = CreateRequire(import.meta.url)

Test('MAKEFILE_PATH', (test) => {
  test.is(Process.env['MAKEFILE_PATH'], Require.resolve('../../makefile'))
})
