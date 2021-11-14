import logger from 'loglevel'
import i18next from 'i18next'
import Papa from 'papaparse'

export function readCSV (file, options) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onloadend = () => {
      let content = reader.result
      const papaParseOptions = Object.assign({ skipEmptyLines: true }, options)
      content = Papa.parse(content, papaParseOptions)
      if (content.errors.length > 0) {
        logger.debug(content.errors)
        reject({ message: i18next.t('errors.INVALID_CSV_FILE', { file: file.name }), errors: content.errors })
      } 
      resolve(content)
    }
    reader.onerror = (error) => {
      logger.debug(error)
      reject({ message: i18next.t('errors.CANNOT_READ_FILE', { file: file.name }), errors: error })
    }
    reader.readAsText(file)
  })
}
