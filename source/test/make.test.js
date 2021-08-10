import Shell from 'shelljs'
import Test from 'ava'

import { Package } from '../library/package.js'

Test.skip('(default)', (test) => {

  let result = Shell.exec('make', { 'silent': true })

  test.is(result.code, 0)
  test.is(result.stdout, `${Package.name}@${Package.version}\n`)

})

Test.skip('version', (test) => {

  let result = Shell.exec('make version', { 'silent': true })

  test.is(result.code, 0)
  test.is(result.stdout, `${Package.name}@${Package.version}\n`)

})

Test.skip('install', (test) => {

  let result = Shell.exec('make install --just-print', { 'silent': true })

  test.is(result.code, 0)
  test.is(result.stdout, 'npm install\n')
  
})

Test.skip('re-install', (test) => {

  let result = Shell.exec('make re-install --just-print', { 'silent': true })

  test.is(result.code, 0)
  test.is(result.stdout,  'rm -Rf node_modules package-lock.json\n' +
                          'npm install\n')
  
})

Test.skip('clean', (test) => {

  let result = Shell.exec('make clean --just-print', { 'silent': true })

  test.is(result.code, 0)
  test.is(result.stdout, 'npx shx rm -Rf coverage process release\n')

})

Test.skip('run', (test) => {

  let result = Shell.exec('make run', { 'silent': true })

  test.is(result.code, 2)
  test.is(result.stdout, 'An argument must be specified (e.g. argument=release/sandbox/index.js)\n')

})

Test.skip('run argument="..."', (test) => {

  let result = Shell.exec('make run argument="release/command/mablung-makefile.js get-version"', { 'silent': true })

  test.is(result.code, 0)
  test.is(result.stdout, `${Package.name}@${Package.version}\n`)

})

Test.skip('cover', (test) => {

  let result = Shell.exec('make cover --just-print', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.is(stdout[stdout.length - 2], 'npx shx mv coverage ../Shared/mablung-makefile')

})

Test.skip('test', (test) => {

  let result = Shell.exec('make test --just-print', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.is(stdout[stdout.length - 2], 'npx ava ')

})

Test.skip('release', (test) => {

  let result = Shell.exec('make release --just-print', { 'silent': true })

  test.is(result.code, 0)
  test.is(result.stdout,  'A version must be specified (e.g. version=prerelease, version=patch, or version=1.0.0)\n' +
                          'npx shx false\n')

})

Test.only('release version=...', (test) => {

  let result = Shell.exec('make release version=prerelease --just-print', { 'silent': true })

  test.is(result.code, 0)
  test.is(result.stdout, '\n')

})
