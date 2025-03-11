module.exports = {
  POSITION: {
    id: 'position-sticky',
    position: 'top',
    offset: [0, 42],
    component: 'stickies/KPosition',
    visible: false
  },
  TARGET: {
    id: 'target-sticky', 
    position: 'center', 
    offset: [0, -20], 
    component: 'stickies/KTarget',
    visible: false
  },
  NORTH: {
    id: 'north-sticky', 
    position: 'bottom-left', 
    offset: [100, 2], 
    component: 'stickies/KNorth',
    visible: true
  },
  ATTRIBUTION: {
    id: 'attribution-sticky',
    position: 'bottom-right', 
    offset: [80, 24], 
    component: 'stickies/KAttribution'
  }
}