module.exports = {
  activityLink: (name, icon, label, params = null) => {
    return {
      id: `${name}-activity-action`,
      icon,
      label,
      renderer: 'item',
      route: { name: `${name}-activity`, params }
    }
  },
  settings: (options) => {
    return Object.assign({
      id: 'settings-action',
      icon: 'las la-cog',
      label: 'layout.SETTINGS',
      renderer: 'item',
      dialog: {
        component: 'app/KSettings',
        title: 'SETTINGS',
        cancelAction: 'CANCEL',
        okAction: {
          id: 'apply-settings', label: 'APPLY', handler: 'apply'
        }
      }
    }, options)
  },
  about: (options) => {
    return Object.assign({
      id: 'about-action',
      icon: 'las la-info',
      label: 'layout.ABOUT',
      renderer: 'item',
      dialog: {
        component: 'app/KAbout', title: 'ABOUT', okAction: 'CLOSE'
      },
    }, options)
  },
  platformInfo: (options) => {
    return Object.assign({
      id: 'platform-info',
      icon: 'las la-desktop',
      label: 'KAbout.PLATFORM_INFO',
      stack: true,
      dialog: {
        title: 'KAbout.PLATFORM_INFO',
        component: 'app/KPlatform',
        okAction: 'CLOSE',
        widthPolicy: 'narrow'
      }
    }, options)
  },
  reportBug: (options) => {
    return Object.assign({
      id: 'report-bug',
      icon: 'las la-bug',
      label: 'KAbout.BUG_REPORT',
      stack: true,
      component: 'action/KBugReportAction'
    }, options)
  },
  legalNotice: (options) => {
    return Object.assign({
      id: 'legal-notice',
      icon: 'las la-gavel',
      label: 'LEGAL_NOTICE',
      dialog: {
      title: 'LEGAL_NOTICE',
        component: 'document/KHtml',
        'component.url': 'legal-notice.html',
        okAction: 'CLOSE'
      }
    }, options)
  },
  privacyPolicy: (options) => {
    return Object.assign({
      id: 'privacy-policy',
      icon: 'las la-shield-alt',
      label: 'PRIVACY_POLICY'
    }, options)
  },
  onlineHelp: (options) => {
    return Object.assign({
      id: 'online-help-action',
      icon: 'las la-book',
      label: 'layout.ONLINE_HELP',
      url,
      renderer: 'item'
    }, options)
  },
  contextualHelp: (options) => {
    // route: default tour route. Default to 'home'
    const route = options?.route || 'home'
    return Object.assign({
      id: 'contextual-help-action',
      icon: 'las la-question-circle',
      label: 'layout.CONTEXTUAL_HELP',
      handler: { name: 'launchTour', params: [route] },
      renderer: 'item'
    }, options)
  },
  logout: (options) => {
    // provider: whether to use an Oauth provider to logout
    const provider = options?.provider
    return Object.assign({
      id: 'logout-action',
      icon: 'las la-sign-out-alt',
      label: 'layout.LOGOUT',
      route: {
        name: 'logout', ...(provider && { params: { provider } })
      },
      renderer: 'item'
    }, options)
  }
}