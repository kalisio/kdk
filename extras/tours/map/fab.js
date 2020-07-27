module.exports = [{
  target: '#probe',
  title: 'tours.fab.PROBE_LABEL',
  content: 'tours.fab.PROBE_CURSOR_LABEL',
  params: {
    placement: 'left'
  }
}, {
  target: '#create-layer',
  title: 'tours.fab.CREATE_LAYER_LABEL',
  link: 'tours.fab.CREATE_LAYER_LINK_LABEL',
  params: {
    placement: 'left',
    clickOnLink: '#create-layer',
    nextDelay: 500
  }
}, {
  target: '#name-field',
  content: 'tours.fab.LAYER_NAME_LABEL',
  params: {
    placement: 'bottom',
    clickOnPrevious: ['#close', 'div.q-fab__icon-holder'],
    previousDelay: 500
  }
}, {
  target: '#description-field',
  content: 'tours.fab.LAYER_DESCRIPTION_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#featureId-field',
  content: 'tours.fab.LAYER_FEATURE_ID_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#schema-field',
  content: 'tours.fab.LAYER_SCHEMA_LABEL',
  params: {
    placement: 'bottom'
  }
}, {
  target: '#apply-button',
  title: 'tours.fab.CREATE_NEW_LAYER_LABEL',
  content: 'tours.fab.EDIT_NEW_LAYER_LABEL',
  params: {
    placement: 'left',
    clickOnNext: '#close'
  }
}, {
  target: '#import-layer',
  title: 'tours.fab.IMPORT_LAYER_LABEL',
  link: 'tours.fab.IMPORT_LAYER_LINK_LABEL',
  params: {
    placement: 'left',
    clickOnLink: '#import-layer',
    nextDelay: 500
  }
}, {
  target: '#file-input',
  content: 'tours.fab.FILE_LABEL',
  params: {
    placement: 'right',
    clickOnPrevious: ['#cancel-button', 'div.q-fab__icon-holder'],
    previousDelay: 500
  }
}, {
  target: '#import-button',
  title: 'tours.fab.CREATE_IMPORT_LAYER_LABEL',
  content: 'tours.fab.ZOOM_IMPORT_LAYER_LABEL',
  params: {
    placement: 'left',
    clickOnNext: '#cancel-button'
  }
}]
