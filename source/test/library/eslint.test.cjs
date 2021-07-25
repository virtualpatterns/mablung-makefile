import Test from 'ava'

import Configuration from '../../library/eslint.cjs'

Test('eslint.cjs', (test) => {
  test.deepEqual(Configuration.env, { 'es6': true, 'node': true })
})
