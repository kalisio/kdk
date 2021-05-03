module.exports = [{
  target: '#unique-tab',
  content: 'tours.add-member.UNIQUE_TAB_LABEL',
  params: {
    placement: 'right'
  }
}, {
  target: '#email-field',
  content: 'tours.add-member.UNQOUE_EMAIL_LABEL',
  params: {
    placement: 'left',
    clickDelay: 500,
    clickOnNext: '#multiple-tab',
    nextDelay: 500,
    clickOnPrevious: '#unique-tab',
    previousDelay: 500
  }
}, {
  target: '#multiple-tab',
  content: 'tours.add-member.MULTIPLE_TAB_LABEL',
  params: {
    placement: 'left'
  }
}, {
  target: '#file-field',
  content: 'tours.add-member.MULTIPLE_FILE_LABEL',
  params: {
    placement: 'left'
  }
}, {
  target: '#add-button',
  content: 'tours.add-member.MULTIPLE_BUTTON_LABEL',
  params: {
    placement: 'left'
  }
}]