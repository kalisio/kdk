import path from 'path-browserify'
import { i18n } from '../i18n.js'

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

export function formatSize (bytes) {
  let value, unit
  if (bytes < 1024) {
    value = bytes
    unit = i18n.t("unit.B")
  } else if (bytes < 1024 ** 2) {
    value = bytes / 1024
    unit = i18n.t("utils.files.KB")
  } else if (bytes < 1024 ** 3) {
    value = bytes / (1024 ** 2)
    unit = i18n.t("utils.files.MB")
  } else {
    value = bytes / (1024 ** 3)
    unit = i18n.t("utils.files.GB")
  }
  return `${Number.isInteger(value) ? value : value.toFixed(2)} ${unit}`
}