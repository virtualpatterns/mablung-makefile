import Test from 'ava'

import { IndexProcess } from './index-process.js'

Test('default', async (test) => {
  let process = new IndexProcess()
  test.is(await process.whenExit(), 0)
})
