import Test from 'ava'

import { Package } from '../../../header/library/package.js'

Test('name', (test) => {
  test.is(Package.name, '@virtualpatterns/mablung-makefile')
})
