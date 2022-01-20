import FileSystem from 'fs-extra'
import Path from 'path'
import URL from 'url'

const FilePath = URL.fileURLToPath(import.meta.url)
const FolderPath = Path.dirname(FilePath)

export function LoadPackage(path = Path.resolve(FolderPath, '../../package.json')) {
  return FileSystem.readJson(path, { 'encoding': 'utf-8' })
}

export function LoadPackageSync(path = Path.resolve(FolderPath, '../../package.json')) {
  return FileSystem.readJsonSync(path, { 'encoding': 'utf-8' })
}
