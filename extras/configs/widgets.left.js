module.exports = {
  LEGEND: {
    id: 'legend-widget',
    label: 'KLegend.LABEL',
    icon: 'las la-atlas',
    scrollable: true,
    content: { component: 'legend/KLegend' }
  },
  FEATURES_SELECTION: {
    id: 'selection-widget',
    label: 'KFeaturesSelection.LABEL',
    icon: 'las la-object-group',
    scrollable: true,
    content: { component: 'selection/KFeaturesSelection' }
  },
  STYLE_MANAGER: {
    id: 'style-manager',
    label: 'KStyleManager.TITLE',
    icon: 'las la-paint-brush',
    scrollable: true,
    content: { component: 'styles/KStyleManager' }
  },
  TAG_MANAGER: {
    id: 'tag-manager',
    label: 'KTagManager.TITLE',
    icon: 'las la-tags',
    scrollable: true,
    content: {
      component: 'tags/KTagManager',
      services: [
        { name: 'styles', property: 'tags', label: 'KStyleManager.TITLE' }
      ]
    }
  }
}
