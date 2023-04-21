import _ from 'lodash'
import path from 'path-browserify'
import { Loading } from 'quasar'
import { i18n } from './i18n.js'
import { Events } from './events.js'

// Export singleton
export const Reader = {
  readers: {},
  register (mimeTypes, reader) {
    if (!_.isArray(mimeTypes)) mimeTypes = [mimeTypes]
    _.forEach(mimeTypes, mimeType => {
      this.readers[mimeType] = reader
      reader.mimeType = mimeType
    })
  },
  filter (filelist) {
    const acceptedFiles = []
    const additionnalFiles = []
    // iterate though the files and sort the files
    for (let i = 0; i < filelist.length; ++i) {
      const file = filelist[i]
      // Check whether a reader is assigned to the file type
      const fileExt = path.extname(file.name)
      let reader = this.readers[fileExt]
      if (reader) {
        acceptedFiles.push({ reader: fileExt, name: file.name, files: [file] })
      } else {
        // Check for additional files to be supported y a reader
        reader = _.find(this.readers, reader => reader.getAdditionalFiles().includes(fileExt))
        if (reader) {
          additionnalFiles.push({ reader: reader.mimeType, file })
        } else {
          const error = { message: i18n.t('errors.UNSUPPORTED_FILE_FORMAT', { file: file.name }) }
          Events.emit('error', error)
        }
      }
    }
    // process the additional files
    _.forEach(additionnalFiles, additionnalFile => {
      const group = _.find(acceptedFiles, acceptedFile => acceptedFile.reader === additionnalFile.reader)
      if (group) group.files.push(additionnalFile.file)
      else {
        const error = { message: i18n.t('errors.UNSUPPORTED_FILE_FORMAT', { file: additionnalFile.name }) }
        Events.emit('error', error)
      }
    })
    return acceptedFiles
  },
  async read (file, options) {
    const reader = this.readers[file.reader]
    Loading.show({ message: i18n.t('reader.READING_FILE', { file: file.name }), html: true })
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
