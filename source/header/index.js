
import { Package } from './library/package.js'

const Process = process

Process.exitCode = 0

try {
  
  console.log()
  console.log(`Package:     ${Package.name}`)
  console.log(`Description: ${Package.description}`)
  console.log(`Version:     ${Package.version}`)
  console.log(`License:     ${Package.license}`)
  console.log(`Author:      ${Package.author}`)
  console.log(`Repository:  ${Package.repository.url}`)
  console.log(`Source:      ${Process.env.SOURCE_PATH}`)

/* c8 ignore next 4 */
} catch (error) {
  console.error(error)
  Process.exitCode = 1
}
