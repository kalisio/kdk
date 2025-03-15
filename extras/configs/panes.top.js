const helpers = require('./helpers.js')

module.exports = {
  locateUser: (options) => {
    // renderer: renderer to be used to display the action
    const renderer = options?.renderer || 'button'
    return {
      id: 'locate-user', 
      label: renderer === 'item' ? 'layout.SHOW_USER_LOCATION' : null,
      tooltip: renderer === 'button' ? 'layout.SHOW_USER_LOCATION' : null,
      toggle: { 
        label: renderer === 'item' ? 'layout.HIDE_USER_LOCATION' : null,
        tooltip: renderer === 'button' ? 'layout.HIDE_USER_LOCATION': null,
      },
      renderer,
      component: 'tools/KGeolocateTool' 
    }
  },
  activeLocationSearchMode: (options) => {
    // renderer: renderer to be used to display the action
    // mode: the mode used to declare the measure tool
    const renderer = options?.renderer || 'button'
    const mode = options?.mode || 'search-location'
    return {
      id: 'search-location', 
      icon: 'las la-search-location', 
      label: renderer === 'item' ? 'layout.SEARCH_LOCATION' : null,
      tooltip: renderer === 'button' ? 'layout.SEARCH_LOCATION' : null,
      handler: { name: 'setTopPaneMode', params: [mode] },
      renderer
    }
  },
  locationSearchMode: (options) => {
    // geocoders: geocoders array to be used as the sources
    // restoreMode: mode to be restored when closing the mode
    const geocoders = options?.geocoders || []
    const restoreMode = options?.restoreMode || 'default'
    return [
      module.exports.restoreMode({ mode: restoreMode, icon: options?.icon, tooltip: options?.tooltip }),
      helpers.verticalSeparator(),
      { 
        component: 'tools/KSearchTool', 
        geocoders,
        autofocus: true 
      }
    ]
  },
  activeMeasureToolMode: (options) => {
      // renderer: renderer to be used to display the action
    // mode: the mode used to declare the location search
    const renderer = options?.renderer || 'item'
    const mode = options?.mode || 'measure-tool'
    return {
      id: 'measure-tool', 
      icon: 'las la-ruler-combined', 
      label: renderer === 'item' ? 'layout.MEASURE_TOOL' : null,
      tooltip: renderer === 'button' ? 'layout.MEASURE_TOOL' : null,
      handler: { name: 'setTopPaneMode', params: [mode] },
      renderer
    }
  },
  measureToolMode: (options) => {
      // restoreMode: mode to be restored when closing the mode
    const restoreMode = options?.restoreMode || 'default'
    return [
      module.exports.restoreMode({ mode: restoreMode, icon: options?.icon, tooltip: options?.tooltip }),
      helpers.verticalSeparator(),
      { component: 'KMeasureTool' }
    ]
  },
  toggleLegend: (options) => {
    // renderer: renderer to be used to display the action
    const renderer = options?.renderer || 'item'    
    return helpers.toggleWidget({
      widgetId: 'legend-widget', 
      icon: 'las la-atlas', 
      showMessage: 'layout.SHOW_LEGEND', 
      hideMessage: 'layout.HIDE_LEGEND', 
      renderer
    })
  },
  toggleTimeSeries: (options) => {
    // renderer: renderer to be used to display the action
    const renderer = options?.renderer || 'item'
    return helpers.toggleWidget({
      widgetId: 'time-series-widget', 
      icon: 'las la-chart-line', 
      showMessage: 'layout.SHOW_TIME_SERIES', 
      hideMessage: 'layout.HIDE_TIME_SERIES', 
      renderer
  })
  },
  togglePosition: (options) => {
    // renderer: renderer to be used to display the action
    const renderer = options?.renderer || 'item'    
    return helpers.toggleSticky({
      stickyId: 'position-sticky', 
      icon: 'las la-plus', 
      showMessage: 'layout.SHOW_POSITION', 
      hideMessage: 'layout.HIDE_POSITION', 
      renderer
    })
  },
  toggleNorthArrow: (options) => {
    // renderer: renderer to be used to display the action
    const renderer = options?.renderer || 'item'    
    return helpers.toggleSticky({
      stickyId: 'north-arrow-sticky', 
      icon: 'las la-location-arrow', 
      showMessage: 'layout.SHOW_NORTH_ARROW', 
      hideMessage: 'layout.HIDE_NORTH_ARROW', 
      renderer
    })
  },
  toggleFullscreen: (options) => {
    // renderer: renderer to be used to display the action
    const renderer = options?.renderer || 'item'    
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
  restoreMode: (options) => {
    // mode: mode to be restored. By default: 'default'
    // icon: icon to be displayed, default is `las la-times`
    // tooltip: tooltip to be displayed
    const mode = options?.mode || 'default'
    const icon = options?.icon || 'las la-times'
    const tooltip = options?.tooltip || null
    return {
      id: `restore-${mode}`, 
      icon,
      tooltip,
      handler: { name: 'setTopPaneMode', params: [mode] }
    }
  }
}