import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import sift from 'sift'
import { Store } from './store.js'
import { bindContent } from './utils/utils.content.js'

const layoutPath = 'layout'
const contentDefaults = { content: undefined, filter: {}, mode: undefined, visible: false }
const paneDefaults = { opener: false, size: [0, 0], state: 'fixed' }
const windowsDefaultControls = { pin: true, unpin: true, maximize: true, restore: true, close: true, resize: true }
const windowDefaults = { state: undefined, position: undefined, size: undefined, current: undefined, controls: windowsDefaultControls }
const hWindowDefaultSizePolicy = {
  minSize: [300, 200],
  floating: { position: [0, 0], size: [300, 200] },
  pinned: { xs: [100, 30], sm: [90, 30], md: [80, 30], lg: [70, 30], xl: [60, 30] }
}
const vWindowDefaultSizePolicy = {
  minSize: [200, 300],
  floating: { position: [0, 0], size: [200, 300] },
  pinned: { xs: [50, 90], sm: [40, 80], md: [30, 75], lg: [25, 75], xl: [20, 75] }
}
const defaults = {
  view: 'lHh LpR lFf',
  padding: true,
  mode: undefined,
  header: { ...contentDefaults },
  footer: { ...contentDefaults },
  page: { ...contentDefaults, size: [0, 0] },
  fab: { ...contentDefaults, icon: 'las la-ellipsis-v', position: 'bottom-right', offset: [16, 16] },
  panes: {
    left: { ...contentDefaults, ...paneDefaults, sizes: 300 },
    top: { ...contentDefaults, ...paneDefaults, sizes: undefined },
    right: { ...contentDefaults, ...paneDefaults, sizes: { xs: [85, 75], sm: [50, 75], md: [35, 80], lg: [25, 80], xl: [20, 85] } },
    bottom: { ...contentDefaults, ...paneDefaults, sizes: undefined }
  },
  windows: {
    left: { ...contentDefaults, ...windowDefaults, sizePolicy: vWindowDefaultSizePolicy },
    top: { ...contentDefaults, ...windowDefaults, sizePolicy: hWindowDefaultSizePolicy },
    right: { ...contentDefaults, ...windowDefaults, sizePolicy: vWindowDefaultSizePolicy },
    bottom: { ...contentDefaults, ...windowDefaults, sizePolicy: hWindowDefaultSizePolicy }
  }
}

// Export singleton
export const Layout = {
  placements: ['top', 'right', 'bottom', 'left'],
  paths: {
    layout: layoutPath,
    view: layoutPath + '.view',
    padding: layoutPath + '.padding',
    mode: layoutPath + '.mode',
    header: layoutPath + '.header',
    footer: layoutPath + '.footer',
    page: layoutPath + '.page',
    fab: layoutPath + '.fab',
    panes: {
      left: layoutPath + '.panes.left',
      top: layoutPath + '.panes.top',
      right: layoutPath + '.panes.right',
      bottom: layoutPath + '.panes.bottom'
    },
    windows: {
      left: layoutPath + '.windows.left',
      top: layoutPath + '.windows.top',
      right: layoutPath + '.windows.right',
      bottom: layoutPath + '.windows.bottom'
    }
  },
  initialize () {
    // create the store structure for each element with their configuration
    Store.set(this.paths.view, this.getElementDefaults('view'))
    Store.set(this.paths.padding, this.getElementDefaults('padding'))
    Store.set(this.paths.header, this.getElementDefaults('header'))
    Store.set(this.paths.footer, this.getElementDefaults('footer'))
    Store.set(this.paths.page, this.getElementDefaults('page'))
    Store.set(this.paths.fab, this.getElementDefaults('fab'))
    this.placements.forEach(placement => {
      Store.set(_.get(this.paths.panes, placement), this.getElementDefaults(`panes.${placement}`))
      Store.set(_.get(this.paths.windows, placement), this.getElementDefaults(`windows.${placement}`))
    })
    // debug message
    logger.debug(`[KDK] Layout initialized with: ${JSON.stringify(this.get(), null, 4)}`)
  },
  get () {
    return Store.get(this.paths.layout)
  },
  setView (view) {
    Store.patch(this.paths.layout, { view })
  },
  clearView () {
    Store.patch(this.paths.layout, { view: this.getElementDefaults('view') })
  },
  setPadding (padding) {
    Store.patch(this.paths.padding, { padding })
  },
  clearPadding () {
    Store.patch(this.paths.layout, { padding: this.getElementDefaults('padding') })
  },
  setMode (mode) {
    this.setHeaderMode(mode)
    this.setFooterMode(mode)
    this.setPageMode(mode)
    this.setFabMode(mode)
    this.placements.forEach(placement => {
      this.setPaneMode(placement, mode)
      this.setWindowMode(placement, mode)
    })
    Store.patch(this.paths.layout, { mode })
  },
  getMode () {
    return this.get().mode
  },
  getElement (element) {
    return Store.get(this.getElementPath(element))
  },
  getElementPath (element) {
    return _.get(this.paths, element)
  },
  getElementDefaults (element) {
    const elementPath = this.getElementPath(element)
    const elementDefaults = _.get(defaults, element)
    const elementConfig = _.get(config, elementPath)
    if (elementConfig) return _.defaultsDeep(_.cloneDeep(elementConfig), elementDefaults)
    return _.cloneDeep(elementDefaults)
  },
  setElement (element, options, context, omit = []) {
    const props = _.defaultsDeep(_.cloneDeep(options), this.getElementDefaults(element))
    const { content, mode } = props
    // process the content
    if (!_.isEmpty(content) && context) props.content = bindContent(content, context, omit)
    // compute components
    if (Array.isArray(content)) props.components = content.filter(sift(props.filter))
    else props.components = _.get(content, mode, []).filter(sift(props.filter))
    // patch the element
    Store.patch(this.getElementPath(element), props)
  },
  setElementMode (element, mode) {
    const props = this.getElement(element)
    if (props.mode === mode) return
    // update components
    let components
    if (Array.isArray(props.content)) components = props.content.filter(sift(props.filter))
    else components = _.get(props.content, mode, []).filter(sift(props.filter))
    // patch the element
    Store.patch(this.getElementPath(element), { mode, components })
  },
  setElementFilter (element, filter) {
    const props = this.getElement(element)
    if (_.isEqual(props.filter, filter)) return
    // update components
    let components
    if (Array.isArray(props.content)) components = props.content.filter(sift(props.filter))
    else components = _.get(props.content, props.mode, []).filter(sift(props.filter))
    // patch the element
    Store.patch(this.getElementPath(element), { filter, components })
  },
  setElementVisible (element, visible) {
    const props = this.getElement(element)
    if (props.visible === visible) return
    Store.patch(this.getElementPath(element), { visible })
  },
  setElementSize (element, size) {
    if (!Array.isArray(size) && size.length !== 2) {
      logger.warn(`[KDK] Invalid size ${size}`)
      return
    }
    const props = this.getElement(element)
    if (_.isEqual(props.size, size)) return
    Store.patch(this.getElementPath(element), { size })
  },
  clearElement (element) {
    this.setElement(element, this.getElementDefaults(element))
  },
  getHeader () {
    return this.getElement('header')
  },
  setHeader (options, context) {
    this.setElement('header', options, context)
  },
  setHeaderMode (mode) {
    this.setElementMode('header', mode)
  },
  setHeaderFilter (filter) {
    this.setElementFilter('header', filter)
  },
  setHeaderVisible (visible) {
    this.setElementVisible('header', visible)
  },
  clearHeader () {
    this.clearElement('header')
  },
  getFooter () {
    return this.getElement('footer')
  },
  setFooter (options, context) {
    this.setElement('footer', options, context)
  },
  setFooterMode (mode) {
    this.setElementMode('footer', mode)
  },
  setFooterFilter (filter) {
    this.setElementFilter('footer', filter)
  },
  setFooterVisible (visible) {
    this.setElementVisible('footer', visible)
  },
  clearFooter () {
    this.clearElement('footer')
  },
  getPage () {
    return this.getElement('page')
  },
  setPage (options, context) {
    this.setElement('page', options, context)
  },
  setPageMode (mode) {
    this.setElementMode('page', mode)
  },
  setPageFilter (filter) {
    this.setElementFilter('page', filter)
  },
  setPageVisible (visible) {
    this.setElementVisible('page', visible)
  },
  clearPage () {
    this.clearElement('page')
  },
  getFab () {
    return this.getElement('fab')
  },
  setFab (options, context) {
    this.setElement('fab', options, context)
  },
  setFabMode (mode) {
    this.setElementMode('fab', mode)
  },
  setFabFilter (filter) {
    this.setElementFilter('fab', filter)
  },
  setFabVisible (visible) {
    this.setElementVisible('fab', visible)
  },
  setFabIcon (icon) {
    const props = this.getElement('fab')
    if (props.icon === icon) return
    Store.patch(this.getElementPath('fab'), { icon })
  },
  setFabPosition (position) {
    if (!['top-left', 'top-right', 'bottom-left', 'bottom-right'].includes(position)) {
      logger.warn(`[KDK] Invalid position ${position}`)
      return
    }
    const props = this.getElement('fab')
    if (props.position === position) return
    Store.patch(this.getElementPath('fab'), { position })
  },
  setFabOffset (offset) {
    if (!Array.isArray(offset) && offset.length !== 2) {
      logger.warn(`[KDK] Invalid offset ${offset}`)
      return
    }
    const props = this.getElement('fab')
    if (props.offset === offset) return
    Store.patch(this.getElementPath('fab'), { offset })
  },
  clearFab () {
    this.clearElement('fab')
  },
  getPane (placement) {
    return this.getElement(`panes.${placement}`)
  },
  setPane (placement, options, context) {
    this.setElement(`panes.${placement}`, options, context)
  },
  setPaneMode (placement, mode) {
    this.setElementMode(`panes.${placement}`, mode)
  },
  setPaneFilter (placement, filter) {
    this.setElementFilter(`panes.${placement}`, filter)
  },
  setPaneVisible (placement, visible) {
    this.setElementVisible(`panes.${placement}`, visible)
  },
  setPaneOpener (placement, opener) {
    const props = this.getElement(`panes.${placement}`)
    if (props.opener === opener) return
    Store.patch(this.getElementPath(`panes.${placement}`), { opener })
  },
  setPaneSizes (placement, sizes) {
    const props = this.getElement(`panes.${placement}`)
    if (_.isEqual(props.sizes, sizes)) return
    Store.patch(this.getElementPath(`panes.${placement}`), { sizes })
  },
  clearPane (placement) {
    this.clearElement(`panes.${placement}`)
  },
  getWindow (placement) {
    return this.getElement(`windows.${placement}`)
  },
  setWindow (placement, options, context) {
    // Take care to not bind widget headers here as they will be when creating widgets
    this.setElement(`windows.${placement}`, options, context, ['header'])
  },
  setWindowMode (placement, mode) {
    this.setElementMode(`windows.${placement}`, mode)
  },
  setWindowFilter (placement, filter) {
    this.setElementFilter(`windows.${placement}`, filter)
  },
  setWindowVisible (placement, visible) {
    this.setElementVisible(`windows.${placement}`, visible)
  },
  setWindowControls (placement, controls) {
    for (const key in _.keys(windowsDefaultControls)) {
      if (!_.has(controls, key)) {
        logger.warn(`[KDK] Invalid window controls ${controls}`)
        return
      }
    }
    const props = this.getElement(`windows.${placement}`)
    if (_.isEqual(props.controls, controls)) return
    Store.patch(this.getElementPath(`windows.${placement}`), { controls })
  },
  setWindowState (placement, state) {
    if (!['pinned', 'floating', 'maximized'].includes(state)) {
      logger.warn(`[KDK] Invalid window state ${state}`)
      return
    }
    const props = this.getElement(`windows.${placement}`)
    if (props.state === state) return
    Store.patch(this.getElementPath(`windows.${placement}`), { state })
  },
  setWindowPosition (placement, position) {
    if (!Array.isArray(position) && position.length !== 2) {
      logger.warn(`[KDK] Invalid position ${position}`)
      return
    }
    const props = this.getElement(`windows.${placement}`)
    if (_.isEqual(props.position, position)) return
    Store.patch(this.getElementPath(`windows.${placement}`), { position })
  },
  setWindowSize (placement, size) {
    this.setElementSize(`windows.${placement}`, size)
  },
  setWindowSizePolicy (placement, policy) {
    if (!policy.minSize || !policy.floating || !policy.pinned) {
      logger.warn(`[KDK] Invalid window sizePolicy ${policy}`)
      return
    }
    const props = this.getElement(`windows.${placement}`)
    if (_.isEqual(props.sizePolicy, policy)) return
    Store.patch(this.getElementPath(`windows.${placement}`), { sizePolicy: policy })
  },
  setWindowCurrent (placement, current) {
    const props = this.getElement(`windows.${placement}`)
    if (props.current === current) return
    // conform current
    const widget = _.find(props.components, { id: current })
    if (!widget) current = _.get(props.components, '[0].id')
    Store.patch(this.getElementPath(`windows.${placement}`), { current })
  },
  clearWindow (placement) {
    this.clearElement(`windows.${placement}`)
  },
  findWindow (widget) {
    for (const placement of this.placements) {
      const window = this.getWindow(placement)
      if (_.find(window.components, { id: widget })) {
        return { placement, window }
      }
    }
    logger.debug(`[KDK] Unable to find the widget ${widget}`)
    return { placement: undefined, window: undefined }
  },
  openWidget (widget) {
    const { placement, window } = this.findWindow(widget)
    if (!placement) return
    if (window.current !== 'current') this.setWindowCurrent(placement, widget)
    if (!window.visible) this.setWindowVisible(placement, true)
  }
}
