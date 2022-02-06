import FileSystem from 'fs-extra'
import Path from 'path'

async function pathExists(sourcePath, targetPath, transformFn) { 

  let information = await FileSystem.stat(sourcePath, { 'bigint': false })

  if (information.isDirectory()) {

    let item = await FileSystem.readdir(sourcePath, { 'encoding': 'utf-8', 'withFileTypes': true })
    
    return Promise.all(item
      .map((item) => pathExists(Path.resolve(sourcePath, item.name), Path.resolve(targetPath, item.name), transformFn)))

  } else {

    let path = transformFn(sourcePath, targetPath)
        
    return Promise.all(path
      .map((path) => FileSystem.pathExists(path).then((exists) => ({ sourcePath, 'targetPath': path, exists }))))

  }

}

export async function PathExists(sourcePath, targetPath = sourcePath, transformFn = (sourcePath, targetPath) => [ targetPath ]) {
  
  let exists = await pathExists(sourcePath, targetPath, transformFn)

  exists = exists
    .flat(Infinity)
    // .map((item) => {
    //   console.dir(item)
    //   return item
    // })
    .reduce((accumulator, item) => accumulator.exists ? item : accumulator, { 'exists': true })
  
  return exists

}