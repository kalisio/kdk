module.exports = [{
  target: '#BaseLayers',
  title: 'tours.catalog-panel.CATALOG_LABEL',
  content: 'tours.catalog-panel.CATEGORIES_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#BaseLayers',
  title: 'tours.catalog-panel.CATEGORY_LABEL',
  params: {
    placement: 'bottom',
    clickOn: '#BaseLayers',
    clickDelay: 1000
  }
}, {
  target: '#Layers.OSM_DARK',
  title: 'tours.catalog-panel.SHOW_LAYER_LABEL',
  params: {
    placement: 'bottom',
    clickOn: '#Layers.OSM_DARK',
    clickDelay: 1000
  }
}, {
  target: '#Layers.OSM_BRIGHT',
  title: 'tours.catalog-panel.HIDE_LAYER_LABEL',
  content: 'tours.catalog-panel.MIN_LEVEL_LABEL',
  params: {
    placement: 'bottom',
    clickOn: '#Layers.OSM_BRIGHT',
    clickDelay: 1000,
    clickOnNext: ['#BaseLayers', '#MeteoLayers'],
    nextDelay: 500
  }
}, {
  target: '#forecast-model',
  title: 'tours.catalog-panel.METEO_MODEL_LABEL',
  content: 'tours.catalog-panel.METEO_LAYERS_LABEL',
  params: {
    placement: 'top',
    clickOnNext: '#MeteoLayers'
  }
}]
