import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import sift from 'sift'
import { Store } from './store.js'
import { bindContent } from './utils/utils.content.js'

const placements = ['top', 'right', 'bottom', 'left']
const layoutPath = 'layout'
const contentDefaults = { content: undefined, filter: {}, mode: undefined, visible: false }
const windowDefaults = { state: undefined, position: undefined, size: undefined, current: undefined }
const hWindowSizePolicy = {
  minSize: [300, 200],
  floating: { position: [0, 0], size: [300, 200] },
  pinned: { xs: [100, 30], sm: [90, 30], md: [80, 30], lg: [70, 30], xl: [60, 30] }
}
const vWindowSizePolicy = {
  minSize: [200, 300],
  floating: { position: [0, 0], size: [200, 300] },
  pinned: { xs: [50, 90], sm: [40, 80], md: [30, 75], lg: [25, 75], xl: [20, 75] }
}
const defaults = {
  layout: { view: 'lHh LpR lFf', mode: undefined },
  header: { ...contentDefaults },
  footer: { ...contentDefaults },
  page: { ...contentDefaults },
  fab: { ...contentDefaults, icon: 'las la-ellipsis-v', position: 'bottom-right', offset: [16, 16] },
  panes: {
    left: { ...contentDefaults, opener: false },
    top: { ...contentDefaults, opener: false },
    right: { ...contentDefaults, opener: false },
    bottom: { ...contentDefaults, opener: false }
  },
  windows: {
    left: { ...contentDefaults, ...windowDefaults, sizePolicy: vWindowSizePolicy },
    top: { ...contentDefaults, ...windowDefaults, sizePolicy: hWindowSizePolicy },
    right: { ...contentDefaults, ...windowDefaults, sizePolicy: vWindowSizePolicy },
    bottom: { ...contentDefaults, ...windowDefaults, sizePolicy: hWindowSizePolicy }
  }
}

// Export singleton
export const Layout = {
  paths: {
    layout: layoutPath,
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
    Store.set(this.paths.layout, this.getLayoutDefaults())
    Store.set(this.paths.header, this.getElementDefaults('header'))
    Store.set(this.paths.footer, this.getElementDefaults('footer'))
    Store.set(this.paths.page, this.getElementDefaults('page'))
    Store.set(this.paths.fab, this.getElementDefaults('fab'))
    placements.forEach(placement => {
      Store.set(_.get(this.paths.panes, placement), this.getElementDefaults(`panes.${placement}`))
      Store.set(_.get(this.paths.windows, placement), this.getElementDefaults(`windows.${placement}`))
    })
    // debug message
    logger.debug(`[KDK] Layout initialized with: ${JSON.stringify(this.get(), null, 4)}`)
  },
  get () {
    return Store.get(this.paths.layout)
  },
  getLayoutDefaults () {
    return Object.assign({}, defaults.options, _.pick(_.get(config, this.paths.layout), _.keys(defaults.layout)))
  },
  set (layout) {
    if (layout.header) this.setHeader(layout.header)
    if (layout.footer) this.setFooter(layout.footer)
    if (layout.page) this.setPage(layout.page)
    if (layout.fab) this.setFab(layout.fab)
    placements.forEach(placement => {
      if (_.has(layout, `panes.${placement}`)) this.setPane(placement, _.get(layout, `panes.${placement}`))
      if (_.has(layout, `windows.${placement}`)) this.setWindow(placement, _.get(layout, `windows.${placement}`))
    })
  },
  setView (view) {
    Store.patch(this.paths.layout, { view })
  },
  setMode (mode) {
    this.setHeaderMode(mode)
    this.setFooterMode(mode)
    this.setPageMode(mode)
    this.setFabMode(mode)
    placements.forEach(placement => {
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
    return _.defaultsDeep(_.cloneDeep(elementConfig), elementDefaults)
  },
  setElement (element, options, context, omit = []) {
    const props = _.defaultsDeep(_.cloneDeep(options), this.getElementDefaults(element))
    const { content, mode } = props
    // process the content
    if (!_.isEmpty(content) && context) props.content = bindContent(content, context, omit)
    // compute components
    if (Array.isArray(content)) props.components = content.filter(sift(props.filter))
    else props.components = _.get(content, mode, []).filter(sift(props.filter))
    // pacth the element
    Store.patch(this.getElementPath(element), props)
  },
  setElementMode (element, mode) {
    const props = this.getElement(element)
    if (props.mode === mode) return
    // update components
    let components
    if (Array.isArray(props.content)) components = props.content.filter(sift(props.filter))
    else components = _.get(props.content, mode, []).filter(sift(props.filter))
    // pacth the element
    Store.patch(this.getElementPath(element), { mode, components })
  },
  setElementFilter (element, filter) {
    const props = this.getElement(element)
    if (_.isEqual(props.filter, filter)) return
    // update components
    let components
    if (Array.isArray(props.content)) components = props.content.filter(sift(props.filter))
    else components = _.get(props.content, props.mode, []).filter(sift(props.filter))
    // pacth the element
    Store.patch(this.getElementPath(element), { filter, components })
  },
  setElementVisible (element, visible) {
    const props = this.getElement(element)
    if (props.visible === visible) return
    Store.patch(this.getElementPath(element), { visible })
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
    if (!Array.isArray(size) && size.length !== 2) {
      logger.warn(`[KDK] Invalid size ${size}`)
      return
    }
    const props = this.getElement(`windows.${placement}`)
    if (_.isEqual(props.size, size)) return
    Store.patch(this.getElementPath(`windows.${placement}`), { size })
  },
  setWindowSizePolicy (placement, policy) {
    if (!policy.minSize || !policy.floating || !policy.pinned) {
      logger.warn(`[KDK] Invalid sizePolicy ${policy}`)
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
  findWindow (widget) {
    let result = { placement: undefined, window: undefined }
    placements.forEach(placement => {
      const window = this.getWindow(placement)
      if (_.find(window.components, { id: widget })) {
        result = { placement, window }
      } else {
        logger.debug(`[KDK] Unable to find the widget ${widget}`)
      }
    })
    return result
  }
}
