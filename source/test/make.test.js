import { DateTime } from 'luxon'
import Shell from 'shelljs'
import BaseTest from 'ava'

import { Package } from '../library/package.js'

const Test = BaseTest.serial

Test.only('(default)', (test) => {

  let result = Shell.exec('make', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes(`${Package.name}@${Package.version}`))

})

Test.only('null', (test) => {
  // an invalid target fails
  test.is(Shell.exec('make null', { 'silent': true }).code, 2)
})

Test.only('null --just-print', (test) => {
  // an invalid target fails even when --just-print
  test.is(Shell.exec('make null --just-print', { 'silent': true }).code, 2)
})

Test.only('commit message="..." --just-print (dirty)', (test) => {

  let name = `${DateTime.utc().toFormat('yyyyLLddHHmmss')}-test`

  Shell.touch(name)

  try {

    let result = Shell.exec('make commit message="test" --just-print', { 'silent': true })
    let stdout = result.stdout.split('\n')

    test.is(result.code, 0)
    test.true(stdout.includes(`git add ${name}`))
    test.true(stdout.includes('git commit --message="test"'))

  } finally {
    Shell.rm(name)
  }

})

Test.only('commit m="..." --just-print (dirty)', (test) => {

  let name = `${DateTime.utc().toFormat('yyyyLLddHHmmss')}-test`

  Shell.touch(name)

  try {

    let result = Shell.exec('make commit m="test" --just-print', { 'silent': true })
    let stdout = result.stdout.split('\n')

    test.is(result.code, 0)
    test.true(stdout.includes(`git add ${name}`))
    test.true(stdout.includes('git commit --message="test"'))

  } finally {
    Shell.rm(name)
  }

})

Test.only('commit --just-print (dirty)', (test) => {

  let name = `${DateTime.utc().toFormat('yyyyLLddHHmmss')}-test`

  Shell.touch(name)

  try {

    let result = Shell.exec('make commit --just-print', { 'silent': true })
    let stdout = result.stdout.split('\n')

    test.is(result.code, 0)
    test.true(stdout.includes('A message must be specified (e.g. message="make tests")'))

  } finally {
    Shell.rm(name)
  }

})

Test.only('commit --just-print (non-dirty)', (test) => {

  let result = Shell.exec('make commit --just-print', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes('Git working directory clean.'))

})

Test.only('update --just-print', (test) => {

  let result = Shell.exec('make update --just-print', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes('npx npm-check-updates --upgrade'))

})
Test.only('version', (test) => {

  let result = Shell.exec('make version', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes(`${Package.name}@${Package.version}`))

})

Test.only('install --just-print', (test) => {

  let result = Shell.exec('make install --just-print', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes('npm install'))
  
})

Test.only('re-install --just-print', (test) => {

  let result = Shell.exec('make re-install --just-print', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)

  test.true(stdout.includes('rm -Rf node_modules package-lock.json'))
  test.true(stdout.includes('npm install'))
  
})

Test.only('clean --just-print', (test) => {

  let result = Shell.exec('make clean --just-print', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes('npx shx rm -Rf coverage process release'))

})

Test.only('run argument="..."', (test) => {

  let result = Shell.exec('make run argument="release/command/mablung-makefile.js get-version"', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes(`${Package.name}@${Package.version}`))

})

Test.only('run a="..."', (test) => {

  let result = Shell.exec('make run a="release/command/mablung-makefile.js get-version"', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes(`${Package.name}@${Package.version}`))

})

Test.only('run', (test) => {

  let result = Shell.exec('make run', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 2)
  test.true(stdout.includes('An argument must be specified (e.g. argument=release/sandbox/index.js)'))

})

Test.only('cover --just-print', (test) => {

  let result = Shell.exec('make cover --just-print', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes('npx shx mv coverage ../Shared/mablung-makefile'))

})

Test.only('cover argument="..." --just-print', (test) => {

  let result = Shell.exec('make cover argument="release/test/make.test.js" --just-print', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)

  test.true(stdout.includes('npx c8 ava release/test/make.test.js'))
  test.true(stdout.includes('npx shx mv coverage ../Shared/mablung-makefile'))

})

Test.only('cover a="..." --just-print', (test) => {

  let result = Shell.exec('make cover a="release/test/make.test.js" --just-print', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)

  test.true(stdout.includes('npx c8 ava release/test/make.test.js'))
  test.true(stdout.includes('npx shx mv coverage ../Shared/mablung-makefile'))

})

Test.only('test --just-print', (test) => {

  let result = Shell.exec('make test --just-print', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes('npx ava '))

})

Test.only('test argument="..." --just-print', (test) => {

  let result = Shell.exec('make test argument="release/test/make.test.js" --just-print', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes('npx ava release/test/make.test.js'))

})

Test.skip('release --just-print', (test) => {

  let result = Shell.exec('make release --just-print', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes('A version must be specified (e.g. version=prerelease, version=patch, or version=1.0.0)'))

})

Test.skip('release version=... --just-print', (test) => {

  let result = Shell.exec('make release version=prerelease --just-print', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes('git push origin master'))

})

Test.skip('release ver=... --just-print', (test) => {

  let result = Shell.exec('make release ver=prerelease --just-print', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes('git push origin master'))

})

Test.skip('release v=... --just-print', (test) => {

  let result = Shell.exec('make release v=prerelease --just-print', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes('git push origin master'))

})

Test.skip('build --just-print', (test) => {

  let result = Shell.exec('make build --just-print', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)

  // test.log(stdout)
  // i don't know where the following commands come from ...
  // rm release/test/header.create release/test/command.create release/test/resource.create
  // rm release/test.create release/header.create release/command.create release/library.create release/sandbox.create

  test.true(stdout.includes('npx shx mkdir -p release/header'))
  test.true(stdout.includes('npx shx mkdir -p release'))

})

Test.skip('debug', (test) => {

  test.timeout(120)

  let result = Shell.exec('make debug', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)

  test.log(stdout)
  test.true(stdout.includes('MAKEFILE_LIST .... makefile include/common include/commit include/update include/build include/debug'))
  test.true(stdout.includes('build-item ....... empty index.cjs index.js index.json sample.DS_Store sample.babelrc.json sample.eslintrc.json'))

})
