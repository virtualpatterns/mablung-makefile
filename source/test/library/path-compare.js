import FileSystem from 'fs-extra'
import Path from 'path'

async function pathCompare(sourcePath, targetPath, transformFn) { 

  let information = await FileSystem.stat(sourcePath, { 'bigint': false })
  let transformedPath = await transformFn(sourcePath, targetPath)

  if (information.isDirectory()) {

    let item = await FileSystem.readdir(sourcePath, { 'encoding': 'utf-8', 'withFileTypes': true })
    
    return Promise.all([
      ...transformedPath
        .map((path) => FileSystem.pathExists(path).then((exists) => ({ path, exists }))),
      ...item
        .map((item) => pathCompare(Path.resolve(sourcePath, item.name), Path.resolve(targetPath, item.name), transformFn))
    ])

  } else {

    return Promise.all([
      ...transformedPath
        .map((path) => FileSystem.pathExists(path).then((exists) => ({ path, exists })))
    ])

  }

}

export async function PathCompare(sourcePath, targetPath = sourcePath, transformFn = (sourcePath, targetPath) => [ targetPath ]) {
  
  let item = await pathCompare(sourcePath, targetPath, transformFn)

  item = item
    .flat(Infinity)
    .sort((left, right) => left.path.localeCompare(right.path))
    .reduce((accumulator, item) => item.exists ? accumulator : (accumulator.exists ? item : accumulator))
  
  return item

}