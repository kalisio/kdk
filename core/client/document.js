import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import sanitize from 'sanitize-html'
import showdown from 'showdown'
import { i18n } from './i18n.js'

export const Document = {
  initialize () {
    this.options = _.get(config, 'document')
    this.options = _.defaultsDeep(this.options, {
      viewers: {
        htm: 'document/KHtml',
        html: 'document/KHtml',
        'text/html': 'document/KHtml',
        md: 'document/KMarkdown',
        'text/markdown': 'document/KMarkdown',
        pdf: 'document/KPdf',
        'application/pdf': 'document/KPdf',
        jpg: 'document/KImage',
        jpeg: 'document/KImage',
        'image/jpeg': 'document/KImage',
        png: 'document/KImage',
        'image/png': 'document/KImage'
      },
      htmlSanitizer: {
        allowedTags: sanitize.defaults.allowedTags.concat(['img'])
      },
      mdConverter: {}
    })
    logger.debug('[KDK] Configuring documents with options:', this.options)
  },
  register (mimeTypes, viewer) {
    if (!_.isArray(mimeTypes)) mimeTypes = [mimeTypes]
    _.forEach(mimeTypes, mimeType => {
      _.set(this.options, `viewers.${mimeType}`, viewer)
    })
  },
  sanitizeHtml (html) {
    if (_.isNil(html)) return null
    return sanitize(html, this.options.htmlSanitizer)
  },
  convertMdToHtml (md) {
    if (_.isNil(md)) return null
    const converter = new showdown.Converter(this.options.mdConverter)
    return converter.makeHtml(md)
  },
  async fetchUrl (url, localize) {
    if (_.isEmpty(url)) return null
    // localize the url if needed
    let urls
    if (localize) urls = i18n.localize(url)
    else urls = [url]
    // try to load the content
    let response
    for (const url of urls) {
      try {
        response = await fetch(url)
        if (response.ok) return response
      } catch (error) {
        // ignore the error
      }
    }
    return null
  }
}
