module.exports = {
  logout: (options) => {
    return Object.assign({
      target: '#logout-action',
      title: 'tours.side-nav.LOGOUT_LABEL',
      content: 'tours.side-nav.SESSION_LABEL',
      params: {
        placement: 'top',
        clickOnNext: '#left-opener'
      }
    }, options)
  },
  contextualHelp: (options) => {
    return Object.assign({
      target: '#contextual-help',
      content: 'tours.side-nav.CONTEXT_HELP_LABEL',
      params: {
        placement: 'top',
        clickOnPrevious: '#left-opener',
        clickOnNext: '#left-opener'
      }
    }, options)
  },
  about: (options) => {
    return Object.assign({
      target: '#about',
      content: 'tours.side-nav.ABOUT_LABEL',
      params: {
        placement: 'top',
        clickOnPrevious: '#left-opener',
        clickOnNext: ['#left-opener', '#about', '#left-opener'],
        nextDelay: 500
      }
    }, options)
  },
  legalNotice: (options) => {
    return Object.assign({
      target: '#legal-notice-action',
      content: 'tours.side-nav.LEGAL_NOTICE_LABEL',
      params: {
        placement: 'top',
        clickOnPrevious: ['#ok-action', '#left-opener'],
        previousDelay: 500
      }
    }, options)
  },
  privacyPolicy: (options) => {
    return Object.assign({
      target: '#privacy-policy-action',
      content: 'tours.side-nav.DATA_POLICY_LABEL',
      params: {
        placement: 'top'
      }
    }, options)
  },
  platformInfo: (options) => {
    return Object.assign({
      target: '#platform-info-action',
      content: 'tours.side-nav.PLATFORM_INFO_LABEL',
      params: {
        placement: 'top'
      }
    }, options)
  },
  reportBug: (options) => {
    return Object.assign({
      target: '#report-bug-action',
      content: 'tours.side-nav.BUG_LABEL',
      params: {
        placement: 'top',
        clickOnPrevious: ['#ok-action', '#left-opener'],
        previousDelay: 500,
        clickOnNext: ['#ok-action', '#left-opener'],
        nextDelay: 500
      }
    }, options)
  }
}
