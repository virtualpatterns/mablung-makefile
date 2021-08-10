import Shell from 'shelljs'
import Test from 'ava'

import { Package } from '../library/package.js'

Test.serial('null', (test) => {
  test.is(Shell.exec('make null', { 'silent': true }).code, 2)
})

Test.serial('null --just-print', (test) => {
  test.is(Shell.exec('make null --just-print', { 'silent': true }).code, 2)
})

Test.serial('(default)', (test) => {

  let result = Shell.exec('make', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes(`${Package.name}@${Package.version}`))

})

Test.serial('version', (test) => {

  let result = Shell.exec('make version', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes(`${Package.name}@${Package.version}`))

})

Test.serial('install --just-print', (test) => {

  let result = Shell.exec('make install --just-print', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes('npm install'))
  
})

Test.serial('re-install --just-print', (test) => {

  let result = Shell.exec('make re-install --just-print', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)

  test.true(stdout.includes('rm -Rf node_modules package-lock.json'))
  test.true(stdout.includes('npm install'))
  
})

Test.serial('clean --just-print', (test) => {

  let result = Shell.exec('make clean --just-print', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes('npx shx rm -Rf coverage process release'))

})

Test.serial('run', (test) => {

  let result = Shell.exec('make run', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 2)
  test.true(stdout.includes('An argument must be specified (e.g. argument=release/sandbox/index.js)'))

})

Test.serial('run argument="..."', (test) => {

  let result = Shell.exec('make run argument="release/command/mablung-makefile.js get-version"', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes(`${Package.name}@${Package.version}`))

})


Test.serial('run arg="..."', (test) => {

  let result = Shell.exec('make run arg="release/command/mablung-makefile.js get-version"', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes(`${Package.name}@${Package.version}`))

})

Test.serial('run a="..."', (test) => {

  let result = Shell.exec('make run a="release/command/mablung-makefile.js get-version"', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes(`${Package.name}@${Package.version}`))

})

Test.serial('cover --just-print', (test) => {

  let result = Shell.exec('make cover --just-print', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes('npx shx mv coverage ../Shared/mablung-makefile'))

})

Test.serial('test --just-print', (test) => {

  let result = Shell.exec('make test --just-print', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes('npx ava '))

})

Test.serial('release --just-print', (test) => {

  let result = Shell.exec('make release --just-print', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes('A version must be specified (e.g. version=prerelease, version=patch, or version=1.0.0)'))

})

Test.serial('release version=... --just-print', (test) => {

  let result = Shell.exec('make release version=prerelease --just-print', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes('git push origin master'))

})

Test.serial('release ver=... --just-print', (test) => {

  let result = Shell.exec('make release ver=prerelease --just-print', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes('git push origin master'))

})

Test.serial('release v=... --just-print', (test) => {

  let result = Shell.exec('make release v=prerelease --just-print', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes('git push origin master'))

})

Test.serial('commit --just-print', (test) => {

  let result = Shell.exec('make commit --just-print', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes('Git working directory clean.'))

})

Test.serial('update --just-print', (test) => {

  let result = Shell.exec('make update --just-print', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes('npx npm-check-updates --upgrade'))

})

Test.serial('build --just-print', (test) => {

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

Test.serial('debug', (test) => {

  let result = Shell.exec('make debug', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)

  test.true(stdout.includes('MAKEFILE_LIST .... makefile include/common include/commit include/update include/build include/debug'))
  test.true(stdout.includes('build-item ....... empty index.cjs index.js index.json sample.DS_Store sample.babelrc.json sample.eslintrc.json'))

})
