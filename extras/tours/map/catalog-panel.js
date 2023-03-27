module.exports = [{
  target: '#catalog-tabbar',
  title: 'tours.catalog-panel.CATALOG_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#user-layers-tab',
  title: 'tours.catalog-panel.USER_LAYERS_LABEL',
  content: 'tours.catalog-panel.CATEGORIES_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#manage-layer-categories',
  title: 'tours.catalog-panel.MANAGE_LAYER_CATEGORIES_LABEL',
  link: 'tours.catalog-panel.MANAGE_LAYER_CATEGORIES_LINK_LABEL',
  params: {
    placement: 'left',
    clickOnLink: '#manage-layer-categories',
    clickOnNext: '#user-views-tab',
    nextDelay: 500
  }
}, {
  target: '#user-views-tab',
  title: 'tours.catalog-panel.USER_VIEWS_LABEL',
  link: 'tours.catalog-panel.USER_VIEWS_CREATE_LABEL',
  params: {
    placement: 'top',
    hoverClickOnLink: 'div.q-fab__icon-holder',
    clickOnPrevious: '#user-layers-tab',
    tour: 'fab'
  }
}, {
  target: '#views-filter',
  title: 'tours.catalog-panel.USER_VIEWS_FILTER_LABEL',
  params: {
    placement: 'top'
  }
},  {
  target: '#views-sorter',
  title: 'tours.catalog-panel.USER_VIEWS_SORTER_LABEL',
  params: {
    placement: 'top',
    blockOnMiss: 'div [component="catalog/KViewSelector"]'
  }
}, {
  target: 'div [component="catalog/KViewSelector"]',
  title: 'tours.catalog-panel.USER_VIEWS_VIEW_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: 'div [component="catalog/KViewSelector"] #set-home-view',
  title: 'tours.catalog-panel.USER_VIEWS_SET_HOME_LABEL',
  params: {
    placement: 'bottom',
    clickOnNext: 'div [component="catalog/KViewSelector"] #view-overflowmenu',
    nextDelay: 500
  }
}, {
  target: '#remove-view',
  title: 'tours.catalog-panel.USER_VIEWS_REMOVE_LABEL',
  params: {
    placement: 'bottom',
    clickOnNext: '#catalog-layers-tab',
    nextDelay: 500
  }
}, {
  target: '#categories-base-layers',
  title: 'tours.catalog-panel.CATEGORY_LABEL',
  params: {
    placement: 'top',
    clickOn: '#categories-base-layers div [role="button"]',
    clickDelay: 500,
    clickOnPrevious: '#user-views-tab',
    previousDelay: 500
  }
}, {
  target: '#layers-osm-dark',
  title: 'tours.catalog-panel.SHOW_LAYER_LABEL',
  params: {
    placement: 'top',
    clickOn: '#layers-osm-dark ',
    clickDelay: 500
  }
}, {
  target: '#layers-osm-bright',
  title: 'tours.catalog-panel.HIDE_LAYER_LABEL',
  content: 'tours.catalog-panel.MIN_LEVEL_LABEL',
  params: {
    placement: 'top',
    clickOn: '#layers-osm-bright',
    clickDelay: 1000,
    clickOnNext: ['#categories-base-layers div [role="button"]', '#categories-meteo-forecast-layers div [role="button"]'],
    nextDelay: 500
  }
}, {
  target: '#forecast-model',
  title: 'tours.catalog-panel.METEO_MODEL_LABEL',
  params: {
    placement: 'top',
    clickOnPrevious: ['#categories-meteo-forecast-layers div [role="button"]', '#categories-base-layers div [role="button"]'],
    previousDelay: 500
  }
}, {
  target: '#layers-wind-tiled',
  title: 'tours.catalog-panel.METEO_LAYERS_LABEL',
  params: {
    placement: 'top'
  }
}]
