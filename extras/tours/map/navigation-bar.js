module.exports = [{
  target: '#top-pane',
  title: 'tours.navigation-bar.NAVIGATION_BAR_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#toggle-map',
  title: 'tours.navigation-bar.TOGGLE_MAP_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#toggle-globe',
  title: 'tours.navigation-bar.TOGGLE_GLOBE_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#zoom-in',
  title: 'tours.navigation-bar.ZOOM_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#locate-user',
  title: 'tours.navigation-bar.GEOLOCATE_LABEL',
  params: {
    placement: 'bottom',
    clickOn: '#locate-user',
    clickDelay: 500,
    clickOnNext: '#locate-user'
  }
}, {
  target: '#search-location',
  title: 'tours.navigation-bar.SEARCH_LOCATION_LABEL',
  params: {
    placement: 'bottom',
    clickOnNext: '#search-location',
    nextDelay: 500
  }
}, {
  target: 'div [component="tools/KSearchTool"]',
  title: 'tours.navigation-bar.LOCATION_SEARCHING_LABEL',
  params: {
    placement: 'bottom',
    clickOnPrevious: ['#back', '#restore-default'],
    previousDelay: 500
  }
}, {
  target: ['#back', '#restore-default'],
  title: 'tours.navigation-bar.SEARCH_BACK_LABEL',
  params: {
    placement: 'bottom',
    clickOnNext: ['#back', '#restore-default'],
    nextDelay: 500
  }
}, {
  target: '#tools',
  title: 'tours.navigation-bar.TOOLS_LABEL',
  params: {
    placement: 'bottom',
    clickOn: '#tools',
    clickOnNext: '#tools',
    clickDelay: 500,
    nextDelay: 500
  }
}, {
  target: '#display-position',
  title: 'tours.navigation-bar.TRACK_LOCATION_LABEL',
  params: {
    placement: 'bottom',
    clickOn: '#tools',
    clickOnNext: ['#tools', '#display-position'],
    nextDelay: 500
  }
}, {
  target: '#position-indicator',
  title: 'tours.navigation-bar.LOCATION_TRACKING_LABEL',
  params: {
    placement: 'bottom',
    clickOnPrevious: ['#back', '#restore-default'],
    previousDelay: 500
  }
}, {
  target: '#copy-position',
  title: 'tours.navigation-bar.COPY_LOCATION_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: ['#back', '#restore-default'],
  title: 'tours.navigation-bar.TRACK_BACK_LABEL',
  params: {
    placement: 'bottom',
    clickOnNext: ['#back', '#restore-default', '#tools'],
    nextDelay: 500
  }
}, {
  target: '#measure-tool',
  title: 'tours.navigation-bar.MEASURE_LABEL',
  params: {
    placement: 'bottom',
    clickOnNext: ['#tools', '#measure-tool'],
    nextDelay: 500
  }
}, {
  target: '#measure-distance',
  title: 'tours.navigation-bar.MEASURE_DISTANCE_LABEL',
  content: 'tours.navigation-bar.MEASURE_DISTANCE_DETAILS_LABEL',
  params: {
    placement: 'bottom',
    clickOnPrevious: ['#back', '#restore-default'],
    previousDelay: 500
  }
}, {
  target: '#measure-area',
  title: 'tours.navigation-bar.MEASURE_AREA_LABEL',
  content: 'tours.navigation-bar.MEASURE_AREA_DETAILS_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#measure-feature',
  title: 'tours.navigation-bar.MEASURE_FEATURE_LABEL',
  content: 'tours.navigation-bar.MEASURE_FEATURE_DETAILS_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#measure-circle',
  title: 'tours.navigation-bar.MEASURE_CIRCLE_LABEL',
  content: 'tours.navigation-bar.MEASURE_CIRCLE_DETAILS_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#clear-measurements',
  title: 'tours.navigation-bar.CLEAR_MEASURE_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: ['#back', '#restore-default'],
  title: 'tours.navigation-bar.MEASURE_BACK_LABEL',
  params: {
    placement: 'bottom',
    clickOnNext: ['#back', '#restore-default', '#tools'],
    nextDelay: 500
  }
}, {
  target: '#capture-map',
  title: 'tours.navigation-bar.CAPTURE_MAP_LABEL',
  params: {
    placement: 'bottom',
    clickOnNext: ['#tools', '#capture-map'],
    nextDelay: 500
  }
},
// {
//   target: '#capture-button',
//   title: 'tours.navigation-bar.CAPTURE_BUTTON_LABEL',
//   params: {
//     placement: 'bottom',
//   }
// }, {
//   target: ['#back', '#restore-default'],
//   title: 'tours.navigation-bar.CAPTURE_BACK_LABEL',
//   params: {
//     placement: 'bottom',
//     clickOnNext: ['#back', '#restore-default'],
//     nextDelay: 500
//   }
// },
{
  target: '#toggle-vr',
  title: 'tours.navigation-bar.TOGGLE_VR_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#toggle-fullscreen',
  title: 'tours.navigation-bar.TOGGLE_FULLSCREEN_LABEL',
  params: {
    placement: 'bottom'
  }
}]
