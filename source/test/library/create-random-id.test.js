import Cryptography from 'crypto'
import Sinon from 'sinon'
import Test from 'ava'

import { CreateRandomId } from './create-random-id.js'

Test.serial('CreateRandomId()', (test) => {
  return test.notThrowsAsync(CreateRandomId())
})

Test.serial('CreateRandomId() throws Error', async (test) => {

  let randomBytesStub = Sinon
    .stub(Cryptography, 'randomBytes')
    .callsArgWith(1, new Error())

  try {
    await test.throwsAsync(CreateRandomId(), { 'instanceOf': Error })
  } finally {
    randomBytesStub.restore()
  }

})

Test.serial('CreateRandomId(8)', async (test) => {
  test.is(await CreateRandomId(8).then((id) => id.length), 8)
})

Test.serial('CreateRandomId(9)', async (test) => {
  test.is(await CreateRandomId(9).then((id) => id.length), 10)
})
