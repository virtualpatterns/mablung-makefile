import Check from 'depcheck';
import Is from '@pwn/is';
import Test from 'ava';

const Process = process;

Test('dependency', async (test) => {

  let unused = await Check(Process.cwd(), {
    'ignoreMatches': [
    '@babel/cli',
    'c8',
    'npm-check-updates',
    'shx']

    // 'specials': [
    //   Check.special.babel,
    //   Check.special.bin,
    //   Check.special.eslint
    // ]
  });

  test.deepEqual(unused.dependencies, []);
  test.deepEqual(unused.devDependencies, []);

  test.true(Is.emptyObject(unused.invalidDirs));
  test.true(Is.emptyObject(unused.invalidFiles));

  test.true(Is.emptyObject(unused.missing));

});

//# sourceMappingURL=dependency.test.js.map