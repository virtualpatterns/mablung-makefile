import { LoadPackage, LoadPackageSync } from '@virtualpatterns/mablung-makefile'
import Path from 'path'
import Test from 'ava'
import URL from 'url'

const FilePath = URL.fileURLToPath(import.meta.url)
const FolderPath = Path.dirname(FilePath)

Test('LoadPackage(\'...\')', (test) => {
  return test.notThrowsAsync(async () => {
    let _package = await LoadPackage(Path.resolve(FolderPath, '../../../package.json'))
    test.is(_package.name, '@virtualpatterns/mablung-makefile')
  })
})

Test('LoadPackageSync(\'...\')', (test) => {
  test.notThrows(() => {
    let _package = LoadPackageSync(Path.resolve(FolderPath, '../../../package.json'))
    test.is(_package.name, '@virtualpatterns/mablung-makefile')
  })
})
