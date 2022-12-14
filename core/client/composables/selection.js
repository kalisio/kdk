import _ from 'lodash'
import { useStore } from './store.js'

export function useSelection (name, options = {}) {
  // Item comparator
  const comparator = options.matches || _.matches
  // data
  // selection store
  const { store, set, get } = useStore(`selections.${name}`)

  // functions
  // Single selection will rely on the lastly selected item only
  // Multiple selection mode will rely on all items
  function clearSelection () {
    set('items', [])
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
  function selectItem (item) {
    const items = get('items')
    const selected = _.find(items, comparator(item))
    if (!selected) items.push(item)
  }
  function unselectItem (item) {
    const items = get('items')
    const index = _.findIndex(items, comparator(item))
    if (index >= 0) items.splice(index, 1)
  }
  function hasSelectedItem () {
    return get('items').length > 0
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
  if (!_.has(store, 'items')) {
    clearSelection()
    set('mode', 'single')
  }

  // expose
  return {
    selection: store,
    clearSelection,
    getSelectionMode,
    setSelectionMode,
    isSingleSelectionMode,
    isMultipleSelectionMode,
    selectItem,
    unselectItem,
    hasSelectedItem,
    hasSelectedItems,
    getSelectedItem,
    getSelectedItems
  }
}
