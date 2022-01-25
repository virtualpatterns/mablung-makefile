import FileSystem from 'fs-extra'
import Path from 'path'
import URL from 'url'

const FilePath = URL.fileURLToPath(import.meta.url)
const FolderPath = Path.dirname(FilePath)

export const Package = FileSystem.readJsonSync(Path.resolve(FolderPath, '../../package.json'), { 'encoding': 'utf-8' })
