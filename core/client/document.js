import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import sanitize from 'sanitize-html'
import { i18n } from './i18n.js'

export const Document = {
  initialize () {
    this.options = _.defaultsDeep(_.get(config, 'document'), {
      viewers: {
        htm: 'document/KHtml',
        html: 'document/KHtml',
        'text/html': 'document/KHtml',
        txt: 'document/KHtml',
        'text/plain': 'document/KHtml',
        csv: 'document/KCsv',
        'text/csv': 'document/KCsv',
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
        webp: 'document/KImage',
        'image/webp': 'document/KImage',
        mp4: 'document/KVideo',
        'video/mp4': 'document/KVideo',
        mkv: 'document/KVideo',
        'video/x-matroska': 'document/KVideo',
        mov: 'document/KVideo',
        'video/quicktime': 'document/KVideo',
        webm: 'document/KVideo',
        'video/webm': 'document/KVideo'
      },
      browser: {
        scrollableViewers: ['document/KHtml', 'document/KMarkdown', 'document/KCsv']
      },
      htmlSanitizer: {
        allowedTags: sanitize.defaults.allowedTags.concat(['img', 'strike']),
        allowedAttributes: _.assign(sanitize.defaults.allowedAttributes, { div: ['style'] }),
        allowedSchemesByTag: { img: [ 'data' ]}
      },
      mdConverter: {}
    })
    logger.debug('[KDK] Document initialized with options:', this.options)
  },
  register (types, viewer) {
    if (!_.isArray(types)) types = [types]
    _.forEach(types, type => {
      _.set(this.options, `viewers.${type}`, viewer)
    })
  },
  getViewer (type) {
    return _.get(this.options, `viewers.${type}`)
  },
  hasViewer (type) {
    return !_.isNil(this.getViewer(type))
  },
  sanitizeHtml (html) {
    if (_.isNil(html)) return null
    return sanitize(html, this.options.htmlSanitizer)
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
