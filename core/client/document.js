import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import sanitize from 'sanitize-html'
import showdown from 'showdown'
import { i18n } from './i18n.js'

export const Document = {
  initialize () {
    this.options = _.defaultsDeep(_.get(config, 'document'), {
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
        'image/png': 'document/KImage',
        apng: 'document/KImage',
        'image/apng': 'document/KImage',        
        gif: 'document/KImage',
        'image/gif': 'document/KImage',        
        svg: 'document/KImage',
        'image/svg+xml': 'document/KImage',
        txt: 'document/KHtml',
        'text/plain': 'document/KHtml',
        'mp4': 'document/KVideo',
        'video/mp4': 'document/KVideo',
        'mkv': 'document/KVideo',
        'video/x-matroska': 'document/KVideo',
        'mov': 'document/KVideo',
        'video/quicktime': 'document/KVideo',
        webp: 'document/KImage',
        'image/webp': 'document/KImage',
        webm: 'document/KVideo',
        'video/webm': 'document/KVideo'
      },
      htmlSanitizer: {
        allowedTags: sanitize.defaults.allowedTags.concat(['img'])
      },
      mdConverter: {}
    })
    logger.debug('[KDK] Configuring documents with options:', this.options)
  },
  register (types, viewer) {
    if (!_.isArray(types)) types = [types]
    _.forEach(types, type => {
      _.set(this.options, `viewers.${type}`, viewer)
    })
  },
  hasViewer (type) {
    return _.get(this.options, `viewers.${type}`) ? true: false
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
