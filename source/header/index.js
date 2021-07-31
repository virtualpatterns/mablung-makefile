import { Package } from './package.js'

console.log()
console.log(`Package:     ${Package.name}`)
console.log(`Description: ${Package.description}`)
console.log(`Version:     ${Package.version}`)
console.log(`License:     ${Package.license}`)
console.log(`Author:      ${Package.author}`)
console.log(`Repository:  ${Package.repository.url}`)
console.log(`Source:      ${process.env.SOURCE_PATH}`)
