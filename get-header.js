import { createRequire as CreateRequire } from 'module'
import FileSystem from 'fs-extra'

const Process = process
const Require = CreateRequire(import.meta.url)

const ThisPackage = FileSystem.readJsonSync(Require.resolve('./package.json'), { 'encoding': 'utf-8' })

Process.exitCode = 0

try {

  console.log()
  console.log(`Package:     ${ThisPackage.name}`)
  console.log(`Description: ${ThisPackage.description}`)
  console.log(`Version:     ${ThisPackage.version}`)
  console.log(`License:     ${ThisPackage.license}`)
  console.log(`Author:      ${ThisPackage.author}`)
  console.log(`Repository:  ${ThisPackage.repository.url}`)
  console.log(`Source:      ${Process.env.SOURCE_PATH}`)

} catch (error) {
  Process.exitCode = 1
  console.error(error)
}
