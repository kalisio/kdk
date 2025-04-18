module.exports = {
  filterView: (options) => {
    return Object.assign({
      id: 'filter-view-sticky',
      position: 'top',
      offset: [0, 50],
      component: 'collection/KFilterView'
    })
  },  
  position: (options) => {
    return Object.assign({
      id: 'position-sticky',
      visible: false,
      offset: [0, 42],
      position: 'top',
      component: 'stickies/KPosition'
    }, options)
  },
  target: (options) => {
    return Object.assign({ 
      id: 'target-sticky',
      visible: false, 
      offset: [0, -20], 
      position: 'center',
      component: 'stickies/KTarget'
    }, options)
  },
  northArrow: (options) => {
    return Object.assign({ 
      id: 'north-arrow-sticky',
      visible: true, 
      offset: [110, 2], 
      position: 'bottom-left',
      component: 'stickies/KNorthArrow' 
    }, options)
  },
  attribution: (options) => {
    return Object.assign({
      id: 'attribution-sticky',
      visible: true, 
      position: 'bottom-right', 
      offset: [80, 24], 
      component: 'stickies/KAttribution'
    }, options)
  }
}