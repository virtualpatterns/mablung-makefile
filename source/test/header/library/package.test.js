import { Package } from '@virtualpatterns/mablung-makefile/package'
import Test from 'ava'

Test('default', (test) => {
  test.is(Package.name, '@virtualpatterns/mablung-makefile')
})
