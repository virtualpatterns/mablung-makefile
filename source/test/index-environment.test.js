import Path from 'path'
import Test from 'ava'
import URL from 'url'

const FolderPath = Path.dirname(URL.fileURLToPath(import.meta.url))
const Process = process

Test('IS_DIRTY', (test) => {
  test.not(Process.env.IS_DIRTY, undefined)
})

Test('MAKE_PATH', (test) => {
  test.not(Process.env.MAKE_PATH, undefined)
})

Test('MAKEFILE_PATH', (test) => {
  test.not(Process.env.MAKEFILE_PATH, undefined)
  test.deepEqual(Process.env.MAKEFILE_PATH.split(' '), [
    Path.resolve(FolderPath, '../../makefile'),
    Path.resolve(FolderPath, '../../include/common'),
    Path.resolve(FolderPath, '../../include/build'),
    Path.resolve(FolderPath, '../../include/clean')
  ])
})
