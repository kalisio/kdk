module.exports = [{
  target: '#tags-field',
  content: 'tours.tag-member.TAG_NAME_LABEL',
  params: {
    placement: 'right',
    clickOnPrevious: '#close-modal',
    previousDelay: 500
  }
}, {
  target: '#apply-button',
  content: 'tours.tag-member.UPDATE_TAG_LABEL',
  params: {
    placement: 'left',
    clickOnNext: '#close-modal',
    nextDelay: 500
  }
}]
