module.exports = {
  activityLink: (name, icon, label) => {
    return {
      id: `${name}-activity-action`,
      icon,
      label,
      renderer: 'item',
      route: { name: `${name}-activity` }
    }
  },
  SETTINGS: {
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
  },
  ABOUT: {
    id: 'about-action',
    icon: 'las la-info',
    label: 'layout.ABOUT',
    renderer: 'item',
    dialog: {
      component: 'app/KAbout', title: 'ABOUT', okAction: 'CLOSE'
    }
  },
  onlineHelp: (url) => {
    return {
      id: 'online-help-action',
      icon: 'las la-book',
      label: 'layout.ONLINE_HELP',
      url,
      renderer: 'item'
    }
  },
  CONTEXTUAL_HELP: {
    id: 'contextual-help-action',
    icon: 'las la-question-circle',
    label: 'layout.CONTEXTUAL_HELP',
    handler: { name: 'launchTour', params: ['home'] },
    renderer: 'item'
  },
  LOGOUT: {
    id: 'logout-action',
    icon: 'las la-sign-out-alt',
    label: 'layout.LOGOUT',
    route: { name: 'logout' },
    renderer: 'item'
  }
}