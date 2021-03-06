import Check from 'depcheck'
import Test from 'ava'

const Process = process

Test('default', async (test) => {

  let unused = await Check(Process.cwd(), {
    'ignoreMatches': [
      '@babel/cli',
      '@babel/preset-env',
      '@virtualpatterns/mablung-makefile',
      'c8',
      'npm-check-updates',
      'shx',
      'sinon'
    ],
    'ignorePatterns': [
      'source/test/resource/copy',
      'source/test/resource/custom',
      'source/test/resource/ignore'
    ],
    'parsers': {
      '**/*.js': [ Check.parser.es7.default ]
      // '**/*.cjs': [ Check.parser.es6, Check.parser.es7.default ],
      // '**/*.js': [ Check.parser.es6, Check.parser.es7.default ]
    }
  })

  // test.log(unused.using)

  test.deepEqual(unused.dependencies, [])
  test.deepEqual(unused.devDependencies, [])
  
  test.deepEqual(unused.missing, {})

  test.deepEqual(unused.invalidDirs, {})
  test.deepEqual(unused.invalidFiles, {})

})
