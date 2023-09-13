module.exports = [{
  target: '#members',
  title: 'tours.members.MEMBERS_LABEL',
  content: 'tours.members.MEMBER_DEFINITION_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#search-member',
  title: 'tours.members.SEARCH_LABEL',
  content: 'tours.members.SEARCH_MORE_LABEL',
  params: {
    placement: 'left'
  }
}, {
  target: '#member-filter',
  title: 'tours.members.FILTER_LABEL',
  params: {
    placement: 'left'
  }
}, {
  target: '#member-sorter',
  title: 'tours.members.SORT_LABEL',
  params: {
    placement: 'left',
    clickOn: '#member-sorter',
    clickDelay: 500,
    clickOnNext: '#member-sorter',
    clickOnPrevious: '#member-sorter'
  }
}, {
  target: '#fab',
  content: 'tours.members.ADD_INVITE_MEMBER_LABEL',
  params: {
    placement: 'left',
    clickOn: 'div.q-fab__icon-holder',
    clickDelay: 500,
    nextDelay: 500
  }
}, {
  target: '#add-member',
  content: 'tours.members.ADD_MEMBER_LABEL',
  link: 'tours.members.ADD_MEMBER_LINK_LABEL',
  params: {
    placement: 'left',
    clickOnPrevious: '#fab',
    previousDelay: 500,
    route: { name: 'add-member' }
  }
}, {
  target: 'div.q-card.q-card--bordered',
  content: 'tours.members.MEMBER_CARD_LABEL',
  params: {
    placement: 'right',
    clickOnPrevious: 'div.q-fab__icon-holder',
    previousDelay: 500
  }
}, {
  target: '#role-badge',
  content: 'tours.members.ROLE_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#tags-section',
  content: 'tours.members.TAGS_LABEL',
  params: {
    placement: 'right'
  }
}, {
  target: '#add-tag',
  content: 'tours.members.ADD_TAG_LABEL',
  link: 'tours.members.ADD_TAG_LINK_LABEL',
  params: {
    placement: 'right',
    clickOnLink: '#add-tag'
  }
}, {
  target: '#groups-section',
  title: 'tours.members.GROUPS_LABEL',
  content: 'tours.members.GROUPS_CONTENT_LABEL',
  params: {
    placement: 'right'
  }
}, {
  target: '#join-group',
  content: 'tours.members.JOIN_GROUP_LABEL',
  link: 'tours.members.JOIN_GROUP_LINK_LABEL',
  params: {
    placement: 'right',
    clickOnLink: '#join-group'
  }
}, {
  target: '#edit-member-role',
  content: 'tours.members.CHANGE_ROLE_LABEL',
  link: 'tours.members.CHANGE_ROLE_LINK_LABEL',
  params: {
    placement: 'bottom',
    clickOnLink: '#edit-member-role'
  }
}, {
  target: '#remove-member',
  title: 'tours.members.REMOVE_MEMBER_LABEL',
  content: 'tours.members.REMOVE_CONFIRMATION_LABEL',
  params: {
    placement: 'left'
  }
}]
