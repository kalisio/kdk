const helpers = require('./helpers.js')

module.exports = {
  activityLink: (name, icon, tooltip, params = null, query = null) => {
    return {
      id: `${name}-activity-action`,
      icon,
      tooltip,
      route: { name: `${name}-activity`, params, query }
    }
  },
  activityStamp: (name, icon, label) => {
    return {
      id: `${name}-activity-stamp`,
      component: 'KStamp',
      icon,
      iconSize: 'sm',
      text: label,
      direction: 'horizontal',
      class: 'text-grey-7'
    }
  },
  searchFilter: (options) => {
    // fields: fields to search on
    const fields = options?.fields || ['name', 'description']
    return {
      component: 'collection/KFilter',
      label: options?.label,
      fields
    }
  },
  timeFilter: (options) => {
    return Object.assign({
      component: 'collection/KTimeFilterControl'
    }, options)
  },
  tagsFilter: (options) => {
    return Object.assign({
      component: 'collection/KTagsFilterControl'
    }, options)
  },
  locateUser: (options) => {
    // renderer: renderer to be used to display the action
    const renderer = options?.renderer || 'button'
    return {
      id: 'locate-user',
      component: 'tools/KGeolocateTool',
      renderer
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
      message: 'layout.LEGEND',
      toggleIcon: { name: 'las la-atlas', color: 'grey-6', overlay: { name: 'las la-slash', color: 'primary', rotation: 90 } },
      hideMessage: 'layout.LEGEND',
      renderer
    })
  },
  toggleTimeSeries: (options) => {
    // renderer: renderer to be used to display the action
    const renderer = options?.renderer || 'item'
    return helpers.toggleWidget({
      widgetId: 'time-series-widget',
      icon: 'las la-chart-line',
      message: 'layout.TIME_SERIES',
      toggleIcon: { name: 'las la-chart-line', color: 'grey-6', overlay: { name: 'las la-slash', color: 'primary', rotation: 90 } },
      renderer
    })
  },
  toggleSelectionManager: (options) => {
    // renderer: renderer to be used to display the action
    const renderer = options?.renderer || 'item'
    return helpers.toggleWidget({
      widgetId: 'selection-widget',
      icon: 'las la-object-group',
      message: 'layout.SELECTION_MANAGER',
      toggleIcon: { name: 'las la-object-group', color: 'grey-6', overlay: { name: 'las la-slash', color: 'primary', rotation: 90 } },
      renderer
    })
  },
  toggleStylesManager: (options) => {
    // renderer: renderer to be used to display the action
    const renderer = options?.renderer || 'item'
    return helpers.toggleWidget({
      widgetId: 'style-manager',
      icon: 'las la-paint-brush',
      message: 'layout.STYLES_MANAGER',
      toggleIcon: { name: 'las la-paint-brush', color: 'grey-6', overlay: { name: 'las la-slash', color: 'primary', rotation: 90 } },
      renderer
    })
  },
  toggleTagsManager: (options) => {
    // renderer: renderer to be used to display the action
    const renderer = options?.renderer || 'item'
    return helpers.toggleWidget({
      widgetId: 'tag-manager',
      icon: 'las la-tags',
      message: 'layout.TAGS_MANAGER',
      toggleIcon: { name: 'las la-tags', color: 'grey-6', overlay: { name: 'las la-slash', color: 'primary', rotation: 90 } },
      renderer
    })
  },
  togglePosition: (options) => {
    // renderer: renderer to be used to display the action
    const renderer = options?.renderer || 'item'
    return helpers.toggleSticky({
      stickyId: 'position-sticky',
      icon: 'las la-plus',
      message: 'layout.POSITION',
      toggleIcon: { name: 'las la-plus', color: 'grey-6', overlay: { name: 'las la-slash', color: 'primary', rotation: 90 } },
      renderer
    })
  },
  toggleZoomControl: (options) => {
    // renderer: renderer to be used to display the action
    const renderer = options?.renderer || 'item'
    return helpers.toggleSticky({
      stickyId: 'zoom-control-sticky',
      icon: 'las la-search-plus',
      message: 'layout.ZOOM_CONTROL',
      toggleIcon: { name: 'las la-search-plus', color: 'grey-6', overlay: { name: 'las la-slash', color: 'primary', rotation: 90 } },
      renderer
    })
  },
  toggleNorthArrow: (options) => {
    // renderer: renderer to be used to display the action
    const renderer = options?.renderer || 'item'
    return helpers.toggleSticky({
      stickyId: 'north-arrow-sticky',
      icon: 'las la-location-arrow',
      message: 'layout.NORTH_ARROW',
      toggleIcon: { name: 'las la-location-arrow', color: 'grey-6', overlay: { name: 'las la-slash', color: 'primary', rotation: 90 } },
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
  printTool: (options) => {
    // renderer: renderer to be used to display the action
    const renderer = options?.renderer || 'item'
    return {
      id: 'print-tool',
      icon: 'las la-print',
      label: renderer === 'item' ? 'layout.PRINT_TOOL' : null,
      tooltip: renderer === 'button' ? 'layout.PRINT_TOOL' : null,
      dialog: {
        component: 'KCapture',
        title: 'layout.PRINT_TOOL',
        cancelAction: 'CANCEL',
        okAction: {
          id: 'print-button',
          label: 'layout.PRINT',
          handler: 'apply'
        }
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
