import logger from 'loglevel'
import i18next from 'i18next'
import Papa from 'papaparse'

export const CSVReader = {
  read (files, options) {
    if (files.length !== 1) {
      logger.debug('invlaid \'fields\' arguments')
      return
    }
    const file = files[0]
    logger.debug(`reading CSV file ${file.name}`)
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        let content = reader.result
        const papaParseOptions = Object.assign({ skipEmptyLines: true }, options)
        content = Papa.parse(content, papaParseOptions)
        if (content.errors.length > 0) {
          logger.debug(content.errors)
          reject(new Error(i18next.t('errors.INVALID_CSV_FILE', { file: file.name }), { errors: content.errors }))
          return
        }
        resolve(content)
      }
      reader.onerror = (error) => {
        logger.debug(error)
        reject(new Error(i18next.t('errors.CANNOT_READ_FILE', { file: file.name }), { errors: error }))
      }
      reader.readAsText(file)
    })
  },
  getAdditionalFiles () {
    return []
  }
}
