module.exports = [{
  target: '#groups',
  title: 'tours.groups.GROUPS_LABEL',
  content: 'tours.groups.GROUP_DEFINITION_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#app-bar-overflow-menu',
  content: 'tours.groups.OVERFLOW_MENU_LABEL',
  params: {
    placement: 'left',
    clickOn: '#app-bar-overflow-menu',
    clickDelay: 500
  }
}, {
  target: '#search-group',
  content: 'tours.groups.SEARCH_LABEL',
  params: {
    placement: 'left'
  }
}, {
  target: '#create-group',
  content: 'tours.groups.NEW_GROUP_LABEL',
  link: 'tours.groups.CREATE_GROUP_LINK_LABEL',
  params: {
    placement: 'left',
    blockOnMiss: 'div.q-card.q-card--bordered',
    route: { name: 'create-group' }
  }
}, {
  target: 'div.q-card.q-card--bordered',
  content: 'tours.groups.GROUP_CARD_LABEL',
  params: {
    placement: 'right'
  }
}, {
  target: '#member',
  content: 'tours.groups.GROUP_MEMBERS_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#manager',
  content: 'tours.groups.GROUP_MANAGERS_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#owner',
  content: 'tours.groups.GROUP_OWNERS_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#edit-group',
  content: 'tours.groups.UPDATE_GROUP_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#list-members',
  content: 'tours.groups.LIST_GROUP_MEMBERS_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#remove-group',
  title: 'tours.groups.REMOVE_GROUP_LABEL',
  content: 'tours.groups.REMOVE_CONFIRMATION_LABEL',
  params: {
    placement: 'left'
  }
}]
