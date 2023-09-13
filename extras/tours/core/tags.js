module.exports = [{
  target: '#tags',
  title: 'tours.tags.TAGS_LABEL',
  content: 'tours.tags.TAG_DEFINITION_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#search-tag',
  content: 'tours.tags.SEARCH_LABEL',
  params: {
    placement: 'left'
  }
}, {
  target: '#tag-sorter',
  title: 'tours.tags.SORT_LABEL',
  params: {
    placement: 'left',
    clickOn: '#tag-sorter',
    clickDelay: 500,
    clickOnNext: '#tag-sorter',
    clickOnPrevious: '#tag-sorter'
  }
}, {
  target: '#create-tag',
  content: 'tours.tags.NEW_TAG_LABEL',
  link: 'tours.tags.CREATE_TAG_LINK_LABEL',
  params: {
    placement: 'left',
    blockOnMiss: 'div.q-card.q-card--bordered',
    route: { name: 'create-tag' }
  }
}, {
  target: 'div.q-card.q-card--bordered',
  content: 'tours.tags.TAG_CARD_LABEL',
  params: {
    placement: 'right'
  }
}, {
  target: '#list-members',
  title: 'tours.tags.TAG_MEMBERS_LABEL',
  content: 'tours.tags.LIST_MEMBERS_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#edit-item-header',
  content: 'tours.tags.UPDATE_TAG_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#edit-item-description',
  content: 'tours.tags.UPDATE_TAG_DESCRIPTION_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#remove-item-header',
  title: 'tours.tags.REMOVE_TAG_LABEL',
  content: 'tours.tags.REMOVE_CONFIRMATION_LABEL',
  params: {
    placement: 'left'
  }
}]
