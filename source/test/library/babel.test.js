import Test from 'ava'

import Configuration from '../../library/babel.cjs'

Test('babel.cjs', (test) => {
  test.deepEqual(Configuration(), {})
})
