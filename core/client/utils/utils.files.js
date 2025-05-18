import path from 'path-browserify'

export function getFileName (filePath) {
  return path.basename(filePath)
}

export function getExtension (filePath) {
  return path.extname(filePath)
}

export function getBaseName (filePath) {
  return path.basename(filePath, getExtension(filePath))
}

export function getDir (filePath) {
  return path.dirname(filePath)
}
