module.exports = {
  locateUser: (renderer = 'button') => {
    return {
      id: 'locate-user', 
      label: renderer === 'item' ? 'layout.LOCATE_SUER' : null,
      tooltip: renderer === 'button' ? 'layout.LOCATE_SUER' : null,
      component: 'tools/KGeolocateTool' 
    }
  },
  searchLocation: (renderer = 'button', mode = 'search-location') => {
    return {
      id: 'search-location', 
      icon: 'las la-search-location', 
      label: renderer === 'item' ? 'layout.SEARCH_LOCATION' : null,
      tooltip: renderer === 'button' ? 'layout.SEARCH_LOCATION' : null,
      handler: { name: 'setTopPaneMode', params: ['search-location'] }
    }
  },
  measureTool: (renderer = 'item', mode = 'measure-tool') => {
    return {
      id: 'measure-tool', 
      icon: 'las la-ruler-combined', 
      label: renderer === 'item' ? 'layout.MEASURE_TOOL' : null,
      tooltip: renderer === 'button' ? 'layout.MEASURE_TOOL' : null,
      handler: { name: 'setTopPaneMode', params: ['measure-tool'] }
    }
  },
  toggleLegend: (renderer = 'item') => {
    return {
      id: 'toggle-legend', 
      icon: 'las la-list', 
      label: renderer === 'item' ? 'layout.SHOW_LEGEND' : null,
      tooltip: renderer === 'button' ? 'layout.SHOW_LEGEND': null,
      toggle: { 
        label: renderer === 'item' ? 'layout.HIDE_LEGEND' : null,
        tooltip: renderer === 'button' ? 'layout.HIDE_LEGEND': null,
      },
      renderer,
      component: 'action/KToggleWidgetVisibility', 
      widgetId: 'legend-widget'
    }
  },
  togglePosition: (renderer = 'item') => {
    return {
      id: 'toggle-position-sticky', 
      icon: 'las la-plus',
      label: renderer === 'item' ? 'layout.SHOW_POSITION' : null,
      tooltip: renderer === 'button' ? 'layout.SHOW_POSITION': null,
      toggle: { 
        label: renderer === 'item' ? 'layout.HIDE_POSITION' : null,
        tooltip: renderer === 'button' ? 'layout.HIDE_POSITION': null,
      },    
      renderer,
      component: 'action/KToggleStickyVisibility', 
      stickyId: 'position-sticky'
    }
  },
  toggleNorthArrow: (renderer = 'item') => {
    return {
      id: 'toggle-north-arrow-sticky', 
      icon: 'las la-location-arrow', 
      label: renderer === 'item' ? 'layout.SHOW_NORTH_ARROW' : null,
      tooltip: renderer === 'button' ? 'layout.SHOW_NORTH_ARROW': null,
      toggle: { 
        label: renderer === 'item' ? 'layout.HIDE_NORTH_ARROW' : null,
        tooltip: renderer === 'button' ? 'layout.HIDE_NORTH_ARROW': null,
      },    
      renderer,
      component: 'action/KToggleStickyVisibility', 
      stickyId: 'north-arrow-sticky'
    }
  },
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
  restoreMode: (mode, tooltip, icon = 'las la-times') => {
    return {
      id: `restore-${mode}`, 
      icon,
      tooltip,
      handler: { name: 'setTopPaneMode', params: [mode] }
    }
  }
}