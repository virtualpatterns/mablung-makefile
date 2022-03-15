import FileSystem from 'fs-extra'
import Json from 'json5'
import Path from 'path'
import URL from 'url'

const FolderPath = Path.dirname(URL.fileURLToPath(import.meta.url))

export const Package = Json.parse(FileSystem.readFileSync(Path.resolve(FolderPath, '../../../package.json'), { 'encoding': 'utf-8' }))