import _ from 'lodash'
import { onBeforeUnmount } from 'vue'
import { useStore } from './store.js'

export function useSelection (name, options = {}) {
  // Item comparator
  const comparator = options.matches || _.matches
  
  // selection store
  const { store, set, get, has } = useStore(`selections.${name}`)

  // Functions
  // Single selection will rely on the lastly selected item only
  // Multiple selection mode will rely on all items
  function clearSelection () {
    if (!isSelectionEnabled()) return
    // Do not force an update if not required
    // We set a new array so that deeply watch is not required
    if (hasSelectedItem()) set('items', [])
  }
  function getSelectionMode () {
    return get('mode')
  }
  function setSelectionMode (mode) {
    return set('mode', mode)
  }
  function isSingleSelectionMode () {
    return get('mode') === 'single'
  }
  function isMultipleSelectionMode () {
    return get('mode') !== 'single'
  }
  function setSelectionEnabled (enabled = true) {
    return set('enabled', enabled)
  }
  function isSelectionEnabled () {
    return get('enabled')
  }
  function getSelectionFilter () {
    return get('filter')
  }
  function setSelectionFilter (filter) {
    return set('filter', filter)
  }
  function selectItem (item) {
    if (!isSelectionEnabled()) return
    const filter = getSelectionFilter()
    if (filter && !filter(item)) return
    const items = get('items')
    const selected = _.find(items, comparator(item))
    // We set a new array so that deeply watch is not required
    if (!selected) set('items', items.concat([item]))
  }
  function unselectItem (item) {
    if (!isSelectionEnabled()) return
    const items = get('items')
    // We set a new array so that deeply watch is not required
    _.remove(items, comparator(item))
    set('items', _.clone(items))
  }
  function hasSelectedItem () {
    return has('items') && get('items').length > 0
  }
  function hasSelectedItems () {
    return hasSelectedItem()
  }
  function getSelectedItem () {
    return _.last(get('items'))
  }
  function getSelectedItems () {
    return get('items')
  }

  // Initialize on first call
  if (!has('items')) {
    // We set a new array so that deeply watch is not required
    set('items', [])
    set('mode', 'single')
    set('enabled', true)
  }

  // Hooks
  // Cleanup on destroy
  onBeforeUnmount(() => {
    setSelectionEnabled()
    clearSelection()
  })

  // Expose
  return {
    selection: store,
    clearSelection,
    getSelectionMode,
    setSelectionMode,
    isSingleSelectionMode,
    isMultipleSelectionMode,
    setSelectionEnabled,
    isSelectionEnabled,
    getSelectionFilter,
    setSelectionFilter,
    selectItem,
    unselectItem,
    hasSelectedItem,
    hasSelectedItems,
    getSelectedItem,
    getSelectedItems
  }
}
