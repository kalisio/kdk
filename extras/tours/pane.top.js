module.exports = {
  toggleMap: (options) => {
    return Object.assign({
      target: '#toggle-map',
      title: 'tours.navigation-bar.TOGGLE_MAP_LABEL',
      params: {
        placement: 'bottom'
      }
    }, options)
  },
  toggleGlobe: (options) => {
    return Object.assign({
      target: '#toggle-globe',
      title: 'tours.navigation-bar.TOGGLE_GLOBE_LABEL',
      params: {
        placement: 'bottom'
      }
    }, options)
  },
  zoomIn: (options) => {
    return Object.assign({
      target: '#zoom-in',
      title: 'tours.navigation-bar.ZOOM_LABEL',
      params: {
        placement: 'bottom'
      }
    }, options)
  },
  locateUser: (options) => {
    return Object.assign({
      target: '#locate-user',
      title: 'tours.navigation-bar.GEOLOCATE_LABEL',
      params: {
        placement: 'bottom',
        clickOn: '#locate-user',
        clickDelay: 500,
        clickOnNext: '#locate-user'
      }
    }, options)
  },
  searchLocation: (options) => {
    return Object.assign({
      target: '#search-location',
      title: 'tours.navigation-bar.SEARCH_LOCATION_LABEL',
      params: {
        placement: 'bottom',
        clickOnNext: '#search-location',
        nextDelay: 500
      }
    }, options)
  },
  searchTool: (options) => {
    return Object.assign({
      target: 'div [component="tools/KSearchTool"]',
      title: 'tours.navigation-bar.LOCATION_SEARCHING_LABEL',
      params: {
        placement: 'bottom',
        clickOnPrevious: '#restore-default',
        previousDelay: 500
      }
    }, options)
  },
  restoreDefault: (options) => {
    return Object.assign({
      target: '#restore-default',
      title: 'tours.navigation-bar.SEARCH_BACK_LABEL',
      params: {
        placement: 'bottom',
        clickOnNext: '#restore-default',
        nextDelay: 500
      }
    }, options)
  },
  toggleLegend: (options) => {
    return Object.assign({
      target: '#toggle-legend-widget',
      title: 'tours.navigation-bar.DISPLAY_LEGEND_LABEL',
      params: {
        placement: 'bottom'
      }
    }, options)
  },
  tools: (options) => {
    return Object.assign({
      target: '#tools',
      title: 'tours.navigation-bar.TOOLS_LABEL',
      params: {
        placement: 'bottom',
        clickOn: '#tools',
        clickOnNext: '#tools',
        clickDelay: 500,
        nextDelay: 500
      }
    }, options)
  },
  togglePosition: (options) => {
    return Object.assign({
      target: '#toggle-position-sticky',
      title: 'tours.navigation-bar.TRACK_LOCATION_LABEL',
      params: {
        placement: 'bottom',
        clickOn: '#tools',
        clickOnNext: ['#tools', '#toggle-position-sticky'],
        nextDelay: 500
      }
    }, options)
  },
  toggleZoomControl: (options) => {
    return Object.assign({
      target: '#toggle-zoom-control-sticky',
      title: 'tours.navigation-bar.ZOOM_CONTROL_LABEL',
      params: {
        placement: 'bottom'
      }
    }, options)
  },
  positionIndicator: (options) => {
    return Object.assign({
      target: '#position-indicator',
      title: 'tours.navigation-bar.LOCATION_TRACKING_LABEL',
      params: {
        placement: 'bottom',
        clickOnPrevious: '#restore-default',
        previousDelay: 500
      }
    }, options)
  },
  copyPosition: (options) => {
    return Object.assign({
      target: '#copy-position',
      title: 'tours.navigation-bar.COPY_LOCATION_LABEL',
      params: {
        placement: 'bottom'
      }
    }, options)
  },
  closePosition: (options) => {
    return Object.assign({
      target: '#close-position',
      title: 'tours.navigation-bar.LOCATION_BACK_LABEL',
      params: {
        placement: 'bottom',
        clickOnNext: ['#back', '#close-position', '#tools'],
        nextDelay: 500
      }
    }, options)
  },
  toggleNorthArrow: (options) => {
    return Object.assign({
      target: '#toggle-north-arrow-sticky',
      title: 'tours.navigation-bar.NORTH_ARROW_LABEL',
      params: {
        placement: 'bottom'
      }
    }, options)
  },
  measureTool: (options) => {
    return Object.assign({
      target: '#measure-tool',
      title: 'tours.navigation-bar.MEASURE_LABEL',
      params: {
        placement: 'bottom',
        clickOnNext: ['#tools', '#measure-tool'],
        nextDelay: 500
      }
    }, options)
  },
  measureDistance: (options) => {
    return Object.assign({
      target: '#measure-distance',
      title: 'tours.navigation-bar.MEASURE_DISTANCE_LABEL',
      content: 'tours.navigation-bar.MEASURE_DISTANCE_DETAILS_LABEL',
      params: {
        placement: 'bottom',
        clickOnPrevious: '#restore-default',
        previousDelay: 500
      }
    }, options)
  },
  measureArea: (options) => {
    return Object.assign({
      target: '#measure-area',
      title: 'tours.navigation-bar.MEASURE_AREA_LABEL',
      content: 'tours.navigation-bar.MEASURE_AREA_DETAILS_LABEL',
      params: {
        placement: 'bottom'
      }
    }, options)
  },
  measureFeature: (options) => {
    return Object.assign({
      target: '#measure-feature',
      title: 'tours.navigation-bar.MEASURE_FEATURE_LABEL',
      content: 'tours.navigation-bar.MEASURE_FEATURE_DETAILS_LABEL',
      params: {
        placement: 'bottom'
      }
    }, options)
  },
  measureCircle: (options) => {
    return Object.assign({
      target: '#measure-circle',
      title: 'tours.navigation-bar.MEASURE_CIRCLE_LABEL',
      content: 'tours.navigation-bar.MEASURE_CIRCLE_DETAILS_LABEL',
      params: {
        placement: 'bottom'
      }
    }, options)
  },
  clearMeasurements: (options) => {
    return Object.assign({
      target: '#clear-measurements',
      title: 'tours.navigation-bar.CLEAR_MEASURE_LABEL',
      params: {
        placement: 'bottom'
      }
    }, options)
  },
  captureMap: (options) => {
    return Object.assign({
      target: '#capture-map',
      title: 'tours.navigation-bar.CAPTURE_MAP_LABEL',
      params: {
        placement: 'bottom',
        clickOnNext: ['#tools', '#capture-map'],
        nextDelay: 500
      }
    }, options)
  },
  toggleVr: (options) => {
    return Object.assign({
      target: '#toggle-vr',
      title: 'tours.navigation-bar.TOGGLE_VR_LABEL',
      params: {
        placement: 'bottom'
      }
    }, options)
  },
  toggleFullscreen: (options) => {
    return Object.assign({
      target: '#toggle-fullscreen',
      title: 'tours.navigation-bar.TOGGLE_FULLSCREEN_LABEL',
      params: {
        placement: 'bottom'
      }
    }, options)
  }
}
