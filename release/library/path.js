import { createRequire as CreateRequire } from 'module';

const Require = CreateRequire(import.meta.url);

export const Path = Require.resolve('../../makefile');

//# sourceMappingURL=path.js.map