import path from 'path'
import i18next from 'i18next'
import { Events } from './events'

// Export singleton
export const Reader = {
  readers: {},
  register (mimeType, reader) {
    this.readers[mimeType] = reader
  },
  async read (file, options) {
    const fileExtension = path.extname(file.name)
    const reader = this.readers[fileExtension]
    if (reader) {
      try {
        const content = await reader(file, options)
        return content
      } catch (error) {
        Events.$emit('error', error)
        throw error
      }
    }
    const error = {
      message: i18next.t('errors.UNSUPPORTED_FILE_FORMAT', { file: file.name })
    }
    Events.$emit('error', error)
    throw new Error(error)
  },
  getSupportedFormats () {
    return Object.keys(this.readers)
  }
}
