import _ from 'lodash'
import path from 'path-browserify'
import i18next from 'i18next'
import { Loading } from 'quasar'
import { Events } from './events.js'

// Export singleton
export const Reader = {
  readers: {},
  register (mimeType, reader) {
    this.readers[mimeType] = reader
    reader.mimeType = mimeType
  },
  filter (filelist) {
    const acceptedFiles = []
    const additionnalFiles = []
    // iterate though the files and sort the files
    for (let i = 0; i < filelist.length; ++i) {
      const file = filelist[i]
      const fileExt = path.extname(file.name)
      let reader = this.readers[fileExt]
      if (reader) {
        acceptedFiles.push({ reader: fileExt, name: file.name, files: [file] })
      } else {
        reader = _.find(this.readers, reader => reader.getAdditionalFiles().includes(fileExt))
        if (reader) {
          additionnalFiles.push({ reader: reader.mimeType, file })
        } else {
          const error = { message: i18next.t('errors.UNSUPPORTED_FILE_FORMAT', { file: file.name }) }
          Events.emit('error', error)
        }
      }
    }
    // process the additional files
    _.forEach(additionnalFiles, additionnalFile => {
      const group = _.find(acceptedFiles, acceptedFile => acceptedFile.reader === additionnalFile.reader)
      if (group) group.files.push(additionnalFile.file)
      else {
        const error = { message: i18next.t('errors.UNSUPPORTED_FILE_FORMAT', { file: additionnalFile.name }) }
        Events.emit('error', error)
      }
    })
    return acceptedFiles
  },
  async read (file, options) {
    const reader = this.readers[file.reader]
    Loading.show({ message: i18next.t('reader.READING_FILE', { file: file.name }) })
    try {
      const content = await reader.read(file.files, options)
      Loading.hide()
      return content
    } catch (error) {
      Loading.hide()
      Events.emit('error', error)
    }
  },
  getSupportedFormats () {
    return Object.keys(this.readers)
  }
}
