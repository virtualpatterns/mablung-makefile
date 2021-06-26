import { createRequire as CreateRequire } from 'module';
import Test from 'ava';

import { Path } from '../../index.js';

const Require = CreateRequire(import.meta.url);

Test('Path', (test) => {
  test.is(Path, Require.resolve('../../../makefile'));
});

//# sourceMappingURL=path.test.js.map