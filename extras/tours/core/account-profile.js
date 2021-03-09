module.exports = [{
  target: '#profile',
  content: 'tours.account.PROFILE_LABEL',
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
  target: '#avatar-field',
  content: 'tours.account.AVATAR_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#name-field',
  content: 'tours.account.NAME_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#apply-button',
  content: 'tours.account.UPDATE_LABEL',
  params: {
    placement: 'left'
  }
}, {
  target: '#security',
  link: 'tours.account.SECURITY_LABEL',
  params: {
    placement: 'bottom',
    clickOnLink: '#security',
    tour: 'account-activity/security'
  }
}, {
  target: '#danger-zone',
  link: 'tours.account.DANGER_ZONE_LABEL',
  params: {
    placement: 'bottom',
    clickOnLink: '#danger-zone',
    tour: 'account-activity/danger-zone'
  }
}]
