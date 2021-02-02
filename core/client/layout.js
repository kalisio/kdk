import { Store } from './store'

const components = ['header', 'footer', 'leftDrawer']

// Export singleton
export const Layout = {
  initialize () {
    components.forEach(component => {
      Store.set(component, { content: null, mode: undefined, visible: false })
    })
  },
  getHeader () {
    return Store.get(components[0])
  },
  setHeader (content, mode, visible) {
    Store.patch(components[0], { content, mode, visible })
  },
  setHeaderMode (mode) {
    Store.patch(components[0], { mode })
  },
  setHeaderVisible (visible) {
    Store.patch(components[0], { visible })
  },
  clearHeader () {
    Store.patch(components[0], { content: null, mode: undefined, visible: false })
  },
  getFooter () {
    return Store.get(components[1])
  },
  setFooter (content, mode, visible) {
    Store.patch(components[1], { content, mode, visible })
  },
  setFooterMode (mode) {
    Store.patch(components[1], { mode })
  },
  setFooterVisible (visible) {
    Store.patch(components[1], { visible })
  },
  clearFooter () {
    Store.patch(components[1], { content: null, mode: undefined, visible: false })
  },
  getLeftDrawer () {
    return Store.get(components[2])
  },
  setLeftDrawer (content, mode, visible) {
    Store.patch(components[2], { content, mode, visible })
  },
  setLeftDrawerMode (mode) {
    Store.patch(components[2], { mode })
  },
  setLeftDrawerVisible (visible) {
    Store.patch(components[2], { visible })
  },
  clearLeftDrawer () {
    Store.patch(components[2], { content: null, mode: undefined, visible: false })
  }
}
