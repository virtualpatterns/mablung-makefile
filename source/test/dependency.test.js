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

  test.deepEqual(unused.dependencies, [])
  test.deepEqual(unused.devDependencies, [
    '@babel/cli',
    'c8',
    'npm-check-updates',
    'shx'
  ])

  test.true(Is.emptyObject(unused.missing))
  test.true(Is.emptyObject(unused.invalidDirs))
  test.true(Is.emptyObject(unused.invalidFiles))

})
