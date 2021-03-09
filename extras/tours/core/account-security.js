module.exports = [{
  target: '#security',
  content: 'tours.account.SECURITY_LABEL',
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
  target: '#password-block',
  link: 'tours.account.PASSWORD_LINK_LABEL',
  params: {
    placement: 'top',
    route: { name: 'change-password' }
  }
}, {
  target: '#email-block',
  link: 'tours.account.EMAIL_LINK_LABEL',
  params: {
    placement: 'top',
    route: { name: 'send-change-identity' }
  }
}, {
  target: '#devices-block',
  title: 'tours.account.DEVICES_LABEL',
  content: 'tours.account.UNLINK_LABEL',
  params: {
    placement: 'top'
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
  target: '#danger-zone',
  link: 'tours.account.DANGER_ZONE_LABEL',
  params: {
    placement: 'bottom',
    clickOnLink: '#danger-zone',
    tour: 'account-activity/danger-zone'
  }
}]
