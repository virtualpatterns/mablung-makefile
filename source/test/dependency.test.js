import Check from 'depcheck'
import Is from '@pwn/is'
import Test from 'ava'

const Process = process

Test('dependency', async (test) => {

  let unused = await Check(Process.cwd(), {
    'ignoreMatches': [
      '@babel/cli',
      'babel-plugin-add-header-comment',
      'c8',
      'npm-check-updates',
      'shx'
    ],
    'parsers': {
      '**/*.cjs': [ Check.parser.es6, Check.parser.es7.default ],
      '**/*.js': [ Check.parser.es6, Check.parser.es7.default ]
    }
  })

  test.deepEqual(unused.dependencies, [])
  test.deepEqual(unused.devDependencies, [])

  test.true(Is.emptyObject(unused.invalidDirs))
  test.true(Is.emptyObject(unused.invalidFiles))
  test.true(Is.emptyObject(unused.missing))

})
