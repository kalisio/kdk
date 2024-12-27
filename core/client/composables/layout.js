import { Layout } from '../layout.js'

export function useLayout () {

  // functions
  function configureLayout (configuration, context) {
    if (_.has(configuration, 'view')) Layout.setView(configuration.view)
    if (_.has(configuration, 'padding')) Layout.setPadding(configuration.padding)
    if (_.has(configuration, 'header')) Layout.setHeader(configuration.header, context)
    if (_.has(configuration, 'footer')) Layout.setFooter(configuration.footer, context)
    if (_.has(configuration, 'page')) Layout.setPage(configuration.page, context)
    if (_.has(configuration, 'stickies')) Layout.setStickies(configuration.stickies, context)
    if (_.has(configuration, 'fab')) Layout.setFab(configuration.fab, context)
    Layout.placements.forEach(placement => {
      if (_.has(configuration, `panes.${placement}`)) Layout.setPane(placement, _.get(configuration, `panes.${placement}`), context)
      if (_.has(configuration, `windows.${placement}`)) Layout.setWindow(placement, _.get(configuration, `windows.${placement}`), context)
    })
    // for backward compatibility
    if (_.has(configuration, 'leftPane')) Layout.setPane('left', configuration.leftPane, context)
    if (_.has(configuration, 'rightPane')) Layout.setPane('right', configuration.rightPane, context)
    if (_.has(configuration, 'topPane')) Layout.setPane('top', configuration.topPane, context)
    if (_.has(configuration, 'bottomPane')) Layout.setPane('bottom', configuration.bottomPane, context)
  }
  function clearLayout () {
    Layout.clearFocus()
    Layout.clearView()
    Layout.clearPadding()
    Layout.clearHeader()
    Layout.clearFooter()
    Layout.clearPage()
    Layout.clearStickies()
    Layout.clearFab()
    Layout.placements.forEach(placement => {
      Layout.clearPane(placement)
      Layout.clearWindow(placement)
    })
  }
  function setLayoutMode (mode) {
    if (mode) Layout.setMode(mode)
  }
  
  // immediate
  const additionalFunctions = {}
  Layout.placements.forEach(placement => {
    additionalFunctions[`set${_.upperFirst(placement)}Pane`] = (options, context) => { Layout.setPane(placement, options, context) }
    additionalFunctions[`set${_.upperFirst(placement)}PaneMode`] = (mode) => { Layout.setPaneMode(placement, mode) }
    additionalFunctions[`set${_.upperFirst(placement)}PaneFilter`] = (filter) => { Layout.setPaneFilter(placement, filter) }
    additionalFunctions[`set${_.upperFirst(placement)}PaneVisible`] = (visible) => { Layout.setPaneVisible(placement, visible) }
    additionalFunctions[`set${_.upperFirst(placement)}PaneOpener`] = (opener) => { Layout.setPaneOpener(placement, opener) }
    additionalFunctions[`clear${_.upperFirst(placement)}Pane`] = () => { Layout.clearPane(placement) }
  })
  
  // expose
  return {
    Layout,
    configureLayout,
    clearLayout,
    setLayoutMode,
    ...additionalFunctions
  }
}