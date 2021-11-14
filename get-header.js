import FileSystem from 'fs-extra'

const Process = process

const ThatPackage = FileSystem.readJsonSync('package.json', { 'encoding': 'utf-8' })

Process.exitCode = 0

try {

  console.log()
  console.log(`Package:     ${ThatPackage.name}`)
  console.log(`Description: ${ThatPackage.description}`)
  console.log(`Version:     ${ThatPackage.version}`)
  console.log(`License:     ${ThatPackage.license}`)
  console.log(`Author:      ${ThatPackage.author}`)
  console.log(`Repository:  ${ThatPackage.repository.url}`)
  console.log(`Source:      ${Process.env.SOURCE_PATH}`)

} catch (error) {
  Process.exitCode = 1
  console.error(error)
}
