module.exports = [{
  target: '#unique-tab',
  content: 'tours.add-member.UNIQUE_TAB_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#email-field',
  content: 'tours.add-member.UNIQUE_EMAIL_LABEL',
  params: {
    placement: 'top',
    clickDelay: 500,
    typeTextOnNext: '#email-field',
    textOnNext: 'guest@organisation.com',
    nextDelay: 500,
    clickOnPrevious: '#unique-tab',
    previousDelay: 500
  }
}, {
  target: '#continue-button',
  content: 'tours.add-member.UNIQUE_CONTINUE_BUTTON_LABEL',
  params: {
    placement: 'left',
    clickOnNext: '#continue-button',
    nextDelay: 500
  }
}, {
  target: '#name-field',
  content: 'tours.add-member.UNIQUE_NAME_LABEL',
  params: {
    placement: 'top',
    clickOnPrevious: '#back-button',
    typeTextOnPrevious: '#email-field',
    textOnPrevious: 'guest@organisation.com',
    previousDelay: 500
  }
}, {
  target: '#role-field',
  content: 'tours.add-member.UNIQUE_ROLE_LABEL',
  params: {
    placement: 'top',
    clickDelay: 500,
    clickOnNext: '#role-field',
    nextDelay: 500,
    clickOnPrevious: '#role-field',
    previousDelay: 500
  }
}, {
  target: '#add-button',
  content: 'tours.add-member.UNIQUE_ADD_BUTTON_LABEL',
  params: {
    placement: 'left',
    nextDelay: 500,
    clickOnNext: '#multiple-tab'
  }
}, {
  target: '#multiple-tab',
  content: 'tours.add-member.MULTIPLE_TAB_LABEL',
  params: {
    placement: 'top',
    clickOnPrevious: '#unique-tab',
  }
}, {
  target: '#file-field',
  content: 'tours.add-member.MULTIPLE_FILE_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#add-button',
  content: 'tours.add-member.MULTIPLE_ADD_BUTTON_LABEL',
  params: {
    placement: 'left'
  }
}]