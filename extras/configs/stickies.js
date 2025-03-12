module.exports = {
  position: (visible = false) => {
    return {
      id: 'position-sticky',
      position: 'top',
      offset: [0, 42],
      component: 'stickies/KPosition',
      visible,
    }
  },
  target: (visible = false) => {
    return {
      id: 'target-sticky', 
      position: 'center', 
      offset: [0, -20], 
      component: 'stickies/KTarget',
      visible
    }
  },
  northArrow: (visible = true) => {
    return {
      id: 'north-arrow-sticky', 
      position: 'bottom-left', 
      offset: [100, 2], 
      component: 'stickies/KNorthArrow',
      visible
    }
  },
  attribution: (visible = true) => {
    return {
      id: 'attribution-sticky',
      position: 'bottom-right', 
      offset: [80, 24], 
      component: 'stickies/KAttribution',
      visible
    }
  }
}