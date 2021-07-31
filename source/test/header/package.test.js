import Test from 'ava'

import { Package } from '../../header/package.js'

Test('name', (test) => {
  test.is(Package.name, '@virtualpatterns/mablung-makefile')
})
