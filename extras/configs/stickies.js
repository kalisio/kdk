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
      position: 'top',      
      offset: [0, 42],
      component: 'stickies/KPosition'
    }, options)
  },
  target: (options) => {
    return Object.assign({ 
      id: 'target-sticky',
      visible: false,
      position: 'center',
      offset: [0, -20], 
      component: 'stickies/KTarget'
    }, options)
  },
  levelSlider: (options) => {
    return Object.assign({ 
      id: 'level-slider-sticky', 
      visible: true,
      position: 'right', 
      offset: [40, 0], 
      component: 'stickies/KLevelSlider',
      vertical: true
    }, options)
  },
  northArrow: (options) => {
    return Object.assign({ 
      id: 'north-arrow-sticky',
      visible: true, 
      position: 'bottom-left',
      offset: [110, 2], 
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