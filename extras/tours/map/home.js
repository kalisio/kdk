module.exports = {
  leftOpener: (options) => {
    return Object.assign({
      target: '#left-opener',
      content: 'tours.home.SIDENAV_LABEL',
      link: 'tours.home.SIDENAV_LINK_LABEL',
      params: {
        placement: 'right',
        hoverClickOnLink: '#left-opener',
        tour: 'side-nav'
      }
    }, options)
  },
  topPane: (options) => {
    return Object.assign({
      target: '#top-pane',
      title: 'tours.navigation-bar.NAVIGATION_BAR_LABEL',
      link: 'tours.home.NAVIGATION_BAR_LINK_LABEL',
      params: {
        placement: 'bottom',
        tour: 'navigation-bar'
      }
    }, options)
  },
  rightOpener: (options) => {
    return Object.assign({
      target: '#right-opener',
      content: 'tours.home.CATALOG_LABEL',
      link: 'tours.home.CATALOG_LINK_LABEL',
      params: {
        placement: 'left',
        hoverClickOnLink: '#right-opener',
        tour: 'catalog-panel'
      }
    }, options)
  },
  fab: (options) => {
    return Object.assign({
      target: '#fab',
      content: 'tours.home.FAB_LABEL',
      link: 'tours.home.FAB_LINK_LABEL',
      params: {
        placement: 'left',
        hoverClickOnLink: 'div.q-fab__icon-holder',
        tour: 'fab'
      }
    }, options)
  }
}
