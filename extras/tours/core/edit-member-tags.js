module.exports = [{
  target: '#tags-field',
  title: 'tours.tag-member.TAG_NAME_LABEL',
  content: 'tours.tag-member.TAG_REMOVE_LABEL',
  params: {
    placement: 'right',
    clickOnPrevious: '#cancel-button',
    previousDelay: 500
  }
}, {
  target: '#apply-button',
  content: 'tours.tag-member.UPDATE_TAG_LABEL',
  params: {
    placement: 'left',
    clickOnNext: '#cancel-button',
    nextDelay: 500
  }
}]
