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
    clickDelay: 1000,
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
  target: '#place-chooser',
  title: 'tours.navigation-bar.LOCATION_SEARCHING_LABEL',
  params: {
    placement: 'bottom',
    clickOnPrevious: '#back',
    previousDelay: 500
  }
}, {
  target: '#back',
  title: 'tours.navigation-bar.SEARCH_BACK_LABEL',
  params: {
    placement: 'bottom',
    clickOnNext: '#back',
    nextDelay: 500
  }
}, {
  target: '#manage-favorite-views',
  title: 'tours.navigation-bar.FAVORITE_VIEWS_LABEL',
  link: 'tours.navigation-bar.FAVORITE_VIEWS_LINK_LABEL',
  params: {
    placement: 'bottom',
    clickOnLink: '#manage-favorite-views',
    tour: 'favorite-views'
  }
}, {
  target: '#tools',
  title: 'tours.navigation-bar.TOOLS_LABEL',
  params: {
    placement: 'bottom',
    clickOn: '#tools',
    clickDelay: 500,
    nextDelay: 500
  }
}, {
  target: '#display-position',
  title: 'tours.navigation-bar.TRACK_LOCATION_LABEL',
  params: {
    placement: 'bottom',
    clickOnNext: '#display-position',
    nextDelay: 500
  }
}, {
  target: '#position-indicator',
  title: 'tours.navigation-bar.LOCATION_TRACKING_LABEL',
  params: {
    placement: 'bottom',
    clickOnPrevious: '#back',
    previousDelay: 500
  }
}, {
  target: '#copy-position',
  title: 'tours.navigation-bar.COPY_LOCATION_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#back',
  title: 'tours.navigation-bar.TRACK_BACK_LABEL',
  params: {
    placement: 'bottom',
    clickOnNext: '#back',
    nextDelay: 500
  }
}, {
  target: '#tools',
  title: 'tours.navigation-bar.TOOLS_LABEL',
  params: {
    placement: 'bottom',
    clickOn: '#tools',
    clickDelay: 500,
    nextDelay: 500
  }
}, {
  target: '#measure-tool',
  title: 'tours.navigation-bar.MEASURE_LABEL',
  params: {
    placement: 'bottom',
    clickOnNext: '#measure-tool',
    nextDelay: 500
  }
}, {
  target: '#measure-distance',
  title: 'tours.navigation-bar.MEASURE_DISTANCE_LABEL',
  content: 'tours.navigation-bar.MEASURE_DISTANCE_DETAILS_LABEL',
  params: {
    placement: 'bottom',
    clickOnPrevious: '#back',
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
  target: '#clear-measurements',
  title: 'tours.navigation-bar.CLEAR_MEASURE_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#back',
  title: 'tours.navigation-bar.MEASURE_BACK_LABEL',
  params: {
    placement: 'bottom',
    clickOnNext: '#back',
    nextDelay: 500
  }
}, , {
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
