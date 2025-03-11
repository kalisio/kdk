module.exports = {
  TOGGLE_LEGEND_VISIBILITY: {
    id: 'toggle-legend', 
    component: 'action/KToggleWidgetVisibility', 
    widgetId: 'legend-widget', 
    icon: 'las la-list', 
    tooltip: 'KToggleWidgetVisibility.SHOW_LEGEND', 
    toggle: { tooltip: 'KToggleWidgetVisibility.HIDE_LEGEND' } 
  },
  TOGGLE_POSITION_VISIBILITY: {
    id: 'toggle-position-sticky', 
    component: 'action/KToggleStickyVisibility', 
    stickyId: 'position-sticky', 
    icon: 'las la-plus', 
    label: 'KToggleStickyVisibility.SHOW_POSITION', 
    toggle: { label: 'KToggleStickyVisibility.HIDE_POSITION' } 
  },
  TOGGLE_NORTH_VISIBILITY: {
    id: 'toggle-north-sticky', 
    component: 'action/KToggleStickyVisibility', 
    stickyId: 'north-sticky', 
    icon: 'las la-location-arrow', 
    label: 'KToggleStickyVisibility.SHOW_NORTH', 
    toggle: { label: 'KToggleStickyVisibility.HIDE_NORTH' } 
  },
  TOGGLE_FULLSCREEN: {
    id: 'toggle-fullscreen',
    icon: 'las la-expand', tooltip: 'mixins.activity.ENTER_FULLSCREEN', 
    toggle: { icon: 'las la-compress', tooltip: 'mixins.activity.EXIT_FULLSCREEN' },
    component: 'action/KToggleFullscreenAction'
  }
}