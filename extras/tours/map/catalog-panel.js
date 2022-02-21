module.exports = [{
  target: '#catalog-tabbar',
  title: 'tours.catalog-panel.CATALOG_LABEL',
  content: 'tours.catalog-panel.TABBAR_LABEL',
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
    nextDelay: 500
  }
}, {
  target: '#user-views-tab',
  title: 'tours.catalog-panel.USER_VIEWS_LABEL',
  params: {
    placement: 'top',
    clickOn: '#user-views-tab'
  }
}, {
  target: '#catalog-layers-tab',
  title: 'tours.catalog-panel.CATALOG_LAYERS_LABEL',
  content: 'tours.catalog-panel.CATEGORIES_LABEL',
  params: {
    placement: 'top',
    clickOn: '#catalog-layers-tab'
  }
}, {
  target: '#k-catalog-panel-base-layers',
  title: 'tours.catalog-panel.CATEGORY_LABEL',
  params: {
    placement: 'top',
    clickOn: '#k-catalog-panel-base-layers * i',
    clickDelay: 1000,
    clickOnPrevious: '#k-catalog-panel-base-layers * i',
    previousDelay: 500
  }
}, {
  target: '#layers-osm-dark',
  title: 'tours.catalog-panel.SHOW_LAYER_LABEL',
  params: {
    placement: 'top',
    clickOn: '#layers-osm-dark * i',
    clickDelay: 1000,
    clickOnPrevious: '#k-catalog-panel-base-layers * i',
    previousDelay: 500
  }
}, {
  target: '#layers-osm-bright',
  title: 'tours.catalog-panel.HIDE_LAYER_LABEL',
  content: 'tours.catalog-panel.MIN_LEVEL_LABEL',
  params: {
    placement: 'top',
    clickOn: '#layers-osm-bright * i',
    clickDelay: 1000,
    clickOnNext: ['#k-catalog-panel-base-layers * i', '#k-catalog-panel-meteo-layers * i'],
    nextDelay: 500
  }
}, {
  target: '#forecast-model',
  title: 'tours.catalog-panel.METEO_MODEL_LABEL',
  params: {
    placement: 'top',
    clickOnPrevious: ['#k-catalog-panel-meteo-layers * i', '#k-catalog-panel-base-layers * i'],
    previousDelay: 500
  }
}, {
  target: '#layers-wind-tiled',
  title: 'tours.catalog-panel.METEO_LAYERS_LABEL',
  params: {
    placement: 'top'
  }
}]
