import FileSystem from 'fs-extra'

const Package = FileSystem.readJsonSync('package.json', { 'encoding': 'utf-8' })

export { Package }