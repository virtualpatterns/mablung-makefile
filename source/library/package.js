import FileSystem from 'fs-extra'
import Path from 'path'
import URL from 'url'

const FolderPath = Path.dirname(URL.fileURLToPath(import.meta.url))

export const Package = FileSystem.readJsonSync(Path.resolve(FolderPath, '../../package.json'), { 'encoding': 'utf-8' })
