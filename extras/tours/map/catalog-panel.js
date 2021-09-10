module.exports = [{
  target: '#KCatalogPanel\\.BASE_LAYERS',
  title: 'tours.catalog-panel.CATALOG_LABEL',
  content: 'tours.catalog-panel.CATEGORIES_LABEL',
  params: {
    placement: 'top'
  }
}, {
  target: '#KCatalogPanel\\.BASE_LAYERS',
  title: 'tours.catalog-panel.CATEGORY_LABEL',
  params: {
    placement: 'top',
    clickOn: '#KCatalogPanel\\.BASE_LAYERS * i',
    clickDelay: 1000,
    clickOnPrevious: '#KCatalogPanel\\.BASE_LAYERS * i',
    previousDelay: 500
  }
}, {
  target: '#Layers\\.OSM_DARK',
  title: 'tours.catalog-panel.SHOW_LAYER_LABEL',
  params: {
    placement: 'top',
    clickOn: '#Layers\\.OSM_DARK',
    clickDelay: 1000,
    clickOnPrevious: '#KCatalogPanel\\.BASE_LAYERS * i',
    previousDelay: 500
  }
}, {
  target: '#Layers\\.OSM_BRIGHT',
  title: 'tours.catalog-panel.HIDE_LAYER_LABEL',
  content: 'tours.catalog-panel.MIN_LEVEL_LABEL',
  params: {
    placement: 'top',
    clickOn: '#Layers\\.OSM_BRIGHT',
    clickDelay: 1000,
    clickOnNext: ['#KCatalogPanel\\.BASE_LAYERS * i', '#KCatalogPanel\\.METEO_LAYERS * i'],
    nextDelay: 500
  }
}, {
  target: '#forecast-model',
  title: 'tours.catalog-panel.METEO_MODEL_LABEL',
  params: {
    placement: 'top',
    clickOnPrevious: ['#KCatalogPanel\\.METEO_LAYERS * i', '#KCatalogPanel\\.BASE_LAYERS * i'],
    previousDelay: 500
  }
}, {
  target: '#Layers\\.WIND_TILED',
  title: 'tours.catalog-panel.METEO_LAYERS_LABEL',
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
}]
