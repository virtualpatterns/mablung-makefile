import { DateTime } from 'luxon'
import Shell from 'shelljs'
import BaseTest from 'ava'

import { Package } from '../library/package.js'

const Test = BaseTest.serial

Test('(default)', (test) => {

  let result = Shell.exec('make', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes(`${Package.name}@${Package.version}`))

})

Test('null', (test) => {
  // an invalid target fails
  test.is(Shell.exec('make null', { 'silent': true }).code, 2)
})

Test('null (dry-run)', (test) => {
  // an invalid target fails even when --dry-run
  test.is(Shell.exec('make --dry-run null', { 'silent': true }).code, 2)
})

;[
  'message',
  'm'
].forEach((variable) => {

  Test(`commit ${variable}=... (dry-run, dirty)`, (test) => {

    let name = `${DateTime.utc().toFormat('yyyyLLddHHmmss')}-test`

    Shell.touch(name)

    try {

      let result = Shell.exec(`make commit ${variable}=test --dry-run`, { 'silent': true })
      let stdout = result.stdout.split('\n')

      test.is(result.code, 0)
      test.true(stdout.includes(`git add ${name}`))
      test.true(stdout.includes('git commit --message="test"'))

    } finally {
      Shell.rm(name)
    }

  })

})

Test('commit (dry-run, dirty)', (test) => {

  let name = `${DateTime.utc().toFormat('yyyyLLddHHmmss')}-test`

  Shell.touch(name)

  try {

    let result = Shell.exec('make --dry-run commit', { 'silent': true })
    let stdout = result.stdout.split('\n')

    test.is(result.code, 0)
    test.true(stdout.includes('A message must be specified (e.g. message="make tests")'))

  } finally {
    Shell.rm(name)
  }

})

Test('commit (dry-run, non-dirty)', (test) => {

  let result = Shell.exec('make --dry-run commit', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes('Git working directory clean.'))

})

Test('update (dry-run)', (test) => {

  let result = Shell.exec('make --dry-run update', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes('npx npm-check-updates --upgrade'))

})

Test('version', (test) => {

  let result = Shell.exec('make version', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes(`${Package.name}@${Package.version}`))

})

Test('install (dry-run)', (test) => {

  let result = Shell.exec('make --dry-run install', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes('npm install'))
  
})

Test('re-install (dry-run)', (test) => {

  let result = Shell.exec('make --dry-run re-install', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)

  test.true(stdout.includes('rm -Rf node_modules package-lock.json'))
  test.true(stdout.includes('npm install'))
  
})

Test('clean (dry-run)', (test) => {

  let result = Shell.exec('make --dry-run clean', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes('npx shx rm -Rf coverage process release'))

})

;[
  'argument',
  'a'
].forEach((variable) => {

  Test(`run ${variable}="..."`, (test) => {

    let result = Shell.exec(`make run ${variable}="release/command/mablung-makefile.js get-version"`, { 'silent': true })
    let stdout = result.stdout.split('\n')

    test.is(result.code, 0)
    test.true(stdout.includes(`${Package.name}@${Package.version}`))

  })

})

Test('run', (test) => {

  let result = Shell.exec('make run', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 2)
  test.true(stdout.includes('An argument must be specified (e.g. argument=release/sandbox/index.js)'))

})

Test('cover (dry-run)', (test) => {

  let result = Shell.exec('make --dry-run cover', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes('npx shx mv coverage ../Shared/mablung-makefile'))

})

;[
  'argument',
  'a'
].forEach((variable) => {

  Test(`cover ${variable}=... --dry-run`, (test) => {

    let result = Shell.exec(`make cover ${variable}=release/test/make.test.js --dry-run`, { 'silent': true })
    let stdout = result.stdout.split('\n')

    test.is(result.code, 0)

    test.true(stdout.includes('npx c8 ava release/test/make.test.js'))
    test.true(stdout.includes('npx shx mv coverage ../Shared/mablung-makefile'))

  })

})

Test('test (dry-run)', (test) => {

  let result = Shell.exec('make --dry-run test', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes('npx ava '))

})

;[
  'argument',
  'a'
].forEach((variable) => {

  Test(`test ${variable}=... --dry-run`, (test) => {

    let result = Shell.exec(`make test ${variable}=release/test/make.test.js --dry-run`, { 'silent': true })
    let stdout = result.stdout.split('\n')

    test.is(result.code, 0)
    test.true(stdout.includes('npx ava release/test/make.test.js'))

  })

})

;[
  'version',
  'v'
].forEach((variable) => {

  Test(`release ${variable}=... (dry-run, non-dirty)`, (test) => {

    let result = Shell.exec(`make release ${variable}=prerelease --dry-run`, { 'silent': true })
    let stdout = result.stdout.split('\n')

    test.is(result.code, 0)
    test.true(stdout.includes('git push origin master'))

  })

})

Test('release (dry-run, non-dirty)', (test) => {

  let result = Shell.exec('make --dry-run release', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.true(stdout.includes('A version must be specified (e.g. version=prerelease, version=patch, or version=1.0.0)'))

})

Test('release (dry-run, dirty)', (test) => {

  let name = `${DateTime.utc().toFormat('yyyyLLddHHmmss')}-test`

  Shell.touch(name)

  try {

    let result = Shell.exec('make --dry-run release', { 'silent': true })
    let stdout = result.stdout.split('\n')

    test.is(result.code, 0)
    test.true(stdout.includes(`Git working directory not clean ... ${name}`))

  } finally {
    Shell.rm(name)
  }

})

Test('build (dry-run)', (test) => {

  let result = Shell.exec('make --dry-run build', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)

  // test.log(stdout)
  // i don't know where the following commands come from ...
  // rm release/test/header.create release/test/command.create release/test/resource.create
  // rm release/test.create release/header.create release/command.create release/library.create release/sandbox.create

  test.true(stdout.includes('npx shx mkdir -p release/header'))
  test.true(stdout.includes('npx shx mkdir -p release'))

})

Test('build exclude-folder=... (dry-run)', (test) => {

  let result = Shell.exec('make --dry-run build exclude-folder=source/test', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)
  test.false(stdout.includes('npx shx mkdir -p release/test'))

})

Test('debug', (test) => {

  test.timeout(240)

  let result = Shell.exec('make debug', { 'silent': true })
  let stdout = result.stdout.split('\n')

  test.is(result.code, 0)

  test.log(stdout)
  test.true(stdout.includes('MAKEFILE_LIST .... makefile include/common include/build include/debug'))
  test.true(stdout.includes('build-item ....... empty index.cjs index.js index.json sample.DS_Store sample.babelrc.json sample.eslintrc.json'))

})
