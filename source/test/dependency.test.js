import Check from 'depcheck'
import Is from '@pwn/is'
import Test from 'ava'

const Process = process

Test('dependency', async (test) => {

  let unused = await Check(Process.cwd(), {
    'ignorePatterns': [
      '/coverage',
      '/process',
      '/sandbox'
    ]
  })

  test.deepEqual(unused.dependencies, [
    '@babel/cli',
    'c8',
    'npm-check-updates',
    'shx'
  ])

  test.deepEqual(unused.devDependencies, [])
  test.true(Is.emptyObject(unused.missing))
  test.true(Is.emptyObject(unused.invalidDirs))
  test.true(Is.emptyObject(unused.invalidFiles))

})
