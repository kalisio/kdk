const helpers = require('./helpers.js')

module.exports = {
  locateUser: (renderer = 'button') => {
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
  searchLocation: (renderer = 'button', mode = 'search-location') => {
    return {
      id: 'search-location', 
      icon: 'las la-search-location', 
      label: renderer === 'item' ? 'layout.SEARCH_LOCATION' : null,
      tooltip: renderer === 'button' ? 'layout.SEARCH_LOCATION' : null,
      handler: { name: 'setTopPaneMode', params: [mode] },
      renderer
    }
  },
  measureTool: (renderer = 'item', mode = 'measure-tool') => {
    return {
      id: 'measure-tool', 
      icon: 'las la-ruler-combined', 
      label: renderer === 'item' ? 'layout.MEASURE_TOOL' : null,
      tooltip: renderer === 'button' ? 'layout.MEASURE_TOOL' : null,
      handler: { name: 'setTopPaneMode', params: [mode] },
      renderer
    }
  },
  toggleLegend: (renderer = 'item') => {
    return helpers.toggleWidget({
      widgetId: 'legend-widget', 
      icon: 'las la-atlas', 
      showMessage: 'layout.SHOW_LEGEND', 
      hideMessage: 'layout.HIDE_LEGEND', 
      renderer
    })
  },
  toggleTimeSeries: (renderer = 'item') => {
    return helpers.toggleWidget({
      widgetId: 'time-series-widget', 
      icon: 'las la-chart-line', 
      showMessage: 'layout.SHOW_TIME_SERIES', 
      hideMessage: 'layout.HIDE_TIME_SERIES', 
      renderer
  })
  },
  togglePosition: (renderer = 'item') => {
    return helpers.toggleSticky({
      stickyId: 'position-sticky', 
      icon: 'las la-plus', 
      showMessage: 'layout.SHOW_POSITION', 
      hideMessage: 'layout.HIDE_POSITION', 
      renderer
    })
  },
  toggleNorthArrow: (renderer = 'item') => {
    return helpers.toggleSticky({
      stickyId: 'north-arrow-sticky', 
      icon: 'las la-location-arrow', 
      showMessage: 'layout.SHOW_NORTH_ARROW', 
      hideMessage: 'layout.HIDE_NORTH_ARROW', 
      renderer
    })
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
  restoreMode: (options) => {
    // mode: mode to be restored 
    // icon: icon to be displayed, default is `las la-times`
    // tooltip: tooltip to be displayed
    const params = Object.assign({ icon: "las la-times" }, options)
    return {
      id: `restore-${params.mode}`, 
      icon: params.icon,
      tooltip: params.tooltip,
      handler: { name: 'setTopPaneMode', params: [params.mode] }
    }
  }
}