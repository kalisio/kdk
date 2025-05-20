module.exports = {
  probeLocation: (options) => {
    return Object.assign({
      target: '#probe-location',
      title: 'tours.fab.PROBE_LABEL',
      content: 'tours.fab.PROBE_CURSOR_LABEL',
      params: {
        placement: 'left'
      }
    }, options)
  },
  addLayer: (options) => {
    return Object.assign({
      target: '#add-layer',
      title: 'tours.fab.ADD_LAYER_LABEL',
      link: 'tours.fab.ADD_LAYER_LINK_LABEL',
      params: {
        placement: 'left',
        clickOnLink: '#add-layer',
        tour: 'add-layer'
      }
    }, options)
  },
  createView: (options) => {
    return Object.assign({
      target: '#create-view',
      title: 'tours.fab.CREATE_VIEW_LABEL',
      link: 'tours.fab.CREATE_VIEW_LINK_LABEL',
      params: {
        placement: 'left',
        clickOnLink: '#create-view',
        tour: 'create-view'
      }
    }, options)
  }
}
