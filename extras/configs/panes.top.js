module.exports = {
  toggleFullscreen: (renderer = 'item') => {
    return {
      id: 'toggle-fullscreen',
      component: 'action/KToggleFullscreenAction',
      icon: 'las la-expand', 
      label: renderer === 'item' ? 'layout.ENTER_FULLSCREEN' : null, 
      tooltip: renderer === 'button' ? 'layout.ENTER_FULLSCREEN' : null,
      toggle: { 
        icon: 'las la-compress', 
        label: renderer === 'item' ? 'layout.EXIT_FULLSCREEN' : null,
        tooltip: renderer === 'button' ? 'layout.EXIT_FULLSCREEN' : null
      },
      renderer
    }
  },
  toggleLegendVisibility: (renderer = 'item') => {
    return {
      id: 'toggle-legend', 
      component: 'action/KToggleWidgetVisibility', 
      widgetId: 'legend-widget', 
      icon: 'las la-list', 
      label: renderer === 'item' ? 'layout.SHOW_LEGEND' : null,
      tooltip: renderer === 'button' ? 'layout.SHOW_LEGEND': null,
      toggle: { 
        label: renderer === 'item' ? 'layout.HIDE_LEGEND' : null,
        tooltip: renderer === 'button' ? 'layout.HIDE_LEGEND': null,
      },
      renderer
    }
  },
  togglePositionVisibility: (renderer = 'item') => {
    return {
      id: 'toggle-position-sticky', 
      component: 'action/KToggleStickyVisibility', 
      stickyId: 'position-sticky', 
      icon: 'las la-plus',
      label: renderer === 'item' ? 'layout.SHOW_POSITION' : null,
      tooltip: renderer === 'button' ? 'layout.SHOW_POSITION': null,
      toggle: { 
        label: renderer === 'item' ? 'layout.HIDE_POSITION' : null,
        tooltip: renderer === 'button' ? 'layout.HIDE_POSITION': null,
      },    
      renderer
    }
  },
  toggleNorthArrowVisibility: (renderer = 'item') => {
    return {
      id: 'toggle-north-arrow-sticky', 
      component: 'action/layout', 
      stickyId: 'north-arrow-sticky', 
      icon: 'las la-location-arrow', 
      label: renderer === 'item' ? 'layout.SHOW_NORTH_ARROW' : null,
      tooltip: renderer === 'button' ? 'layout.SHOW_NORTH_ARROW': null,
      toggle: { 
        label: renderer === 'item' ? 'layout.HIDE_NORTH_ARROW' : null,
        tooltip: renderer === 'button' ? 'layout.HIDE_NORTH_ARROW': null,
      },    
      renderer
    }
  }
}