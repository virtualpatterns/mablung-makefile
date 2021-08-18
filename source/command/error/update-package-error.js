import Is from '@pwn/is'
import Path from 'path'

import { CommandError } from './command-error.js'

class UpdatePackageError extends CommandError {

  constructor(path) {
    super(`Unable to update the path '${Is.equal(Path.relative('', path), '') ? path : Path.relative('', path)}'.`)
  }

}

export { UpdatePackageError }
