module.exports = [{
  target: '#edit-profile',
  content: 'tours.account.PROFILE_LABEL',
  params: {
    placement: 'bottom',
    clickOnPrevious: '#left-opener',
    clickOnNext: ['#left-opener', '#edit-profile'],
    nextDelay: 500
  }
}, {
  target: '#name-field',
  content: 'tours.account.NAME_LABEL',
  params: {
    placement: 'bottom',
    clickOnPrevious: ['#cancel-action', '#left-opener'],
    previousDelay: 500
  }
}, {
  target: '#avatar-field',
  content: 'tours.account.AVATAR_LABEL',
  params: {
    placement: 'bottom'
  }
},  {
  target: '#ok-button',
  content: 'tours.account.UPDATE_LABEL',
  params: {
    placement: 'left',
    clickOnNext: ['#cancel-action', '#left-opener'],
    nextDelay: 500
  }
}]
