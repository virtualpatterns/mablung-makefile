import { CreateId } from '@virtualpatterns/mablung-makefile/test'
import Cryptography from 'crypto'
import Sinon from 'sinon'
import Test from 'ava'

Test.serial('CreateId()', (test) => {
  return test.notThrowsAsync(CreateId())
})

Test.serial('CreateId() throws Error', async (test) => {

  let randomBytesStub = Sinon
    .stub(Cryptography, 'randomBytes')
    .callsArgWith(1, new Error())

  try {
    await test.throwsAsync(CreateId(), { 'instanceOf': Error })
  } finally {
    randomBytesStub.restore()
  }

})

Test.serial('CreateId(8)', async (test) => {
  test.is(await CreateId(8).then((id) => id.length), 8)
})

Test.serial('CreateId(9)', async (test) => {
  test.is(await CreateId(9).then((id) => id.length), 10)
})
