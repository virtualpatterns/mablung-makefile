import Check from 'depcheck'
import Test from 'ava'

const Process = process

Test('dependency', async (test) => {

  let unused = await Check(Process.cwd(), {
    'ignoreMatches': [
      '@babel/cli',
      '@babel/core',
      '@babel/preset-env',
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

  test.deepEqual(unused.invalidDirs, {})
  test.deepEqual(unused.invalidFiles, {})
  test.deepEqual(unused.missing, {})

})
