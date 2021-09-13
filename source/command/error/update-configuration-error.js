import Is from '@pwn/is'
import Path from 'path'

import { IndexError } from './index-error.js'

class UpdateConfigurationError extends IndexError {

  constructor(path) {
    /* c8 ignore next 1 */
    super(`Unable to update the path '${Is.equal(Path.relative('', path), '') ? path : Path.relative('', path)}'.`)
  }

}

export { UpdateConfigurationError }
