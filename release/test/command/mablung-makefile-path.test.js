import Test from 'ava';

import { MablungMakefilePathProcess } from './mablung-makefile-path-process.js';

Test('mablung-makefile-path', async (test) => {
  let process = new MablungMakefilePathProcess();
  test.is(await process.whenExit(), 0);
});
