module.exports = [{
  target: '#danger-zone',
  link: 'tours.account.DANGER_ZONE_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#home',
  link: 'tours.account.HOME_LABEL',
  params: {
    placement: 'bottom',
    clickOnLink: '#home',
    tour: 'home'
  }
}, {
  target: '#delete-block',
  content: 'tours.account.DELETE_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#profile',
  link: 'tours.account.PROFILE_LABEL',
  params: {
    placement: 'bottom',
    clickOnLink: '#profile',
    tour: 'account-activity/profile'
  }
}, {
  target: '#security',
  link: 'tours.account.SECURITY_LABEL',
  params: {
    placement: 'bottom',
    clickOnLink: '#security',
    tour: 'account-activity/security'
  }
}]
