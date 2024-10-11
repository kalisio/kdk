<template>
  <KTree :nodes="lazy" node-key="path" @lazy-load="onLazyLoad"/>
</template>

<script setup>
import _ from 'lodash'
import moment from 'moment'
import { Store, i18n } from '..'
import { ref } from 'vue'
import KTree from './KTree'
import { Events } from '../events.js'

// Data
const lazy = ref(_.remove(addPath(convertStore(Store, 1)), (value) => value.label))

// Make store react to external changes to update the tree
Events.on('store-changed', (path, value) => updateLazy(path, value))

// functions
function onLazyLoad ({ node, key, done, fail }) {
  done(convertStore(_.get(Store, key), 1))
  lazy.value = addPath(lazy.value)
}
function convertStore (node, maxDepth = -1, depth = 0) {
  if (maxDepth >= 0 && maxDepth === depth) return

  return _.keys(node).map(key => {
    const child = node[key]

    if (_.isFunction(child)) {
      return {}
    }
    if (moment.isMoment(child)) {
      return {
        label: child.toISOString(),
        children: []
      }
    }
    if (_.isArray(child)) {
      return {
        label: key,
        lazy: true,
        children: convertStore(Object.assign({}, child), maxDepth, depth)
      }
    }
    if (_.isObject(child)) {
      return {
        label: key,
        lazy: true,
        children: convertStore(child, maxDepth, depth + 1)
      }
    }
    return {
      label: key,
      children: [{ label: i18n.tie(child) ? i18n.tie(child) : child, children: [] }]
    }
  })
}
function updateLazy (path, value) {
  _.keys(value).forEach(key => {
    const child = value[key]
    if (!_.isArray(child)) {
      const found = findNode(lazy, 'path', path + '.' + key)
      if (found && _.has(found, 'children') && found.children[0].label !== child) {
        lazy.value = addPath(updateValue(lazy.value, found.children[0].path, child))
      }
    }
  })
}
function addPath (items, path = []) {
  return items.map(({ label, children, ...rest }, _, __, newPath = [...path, label]) => ({
    ...rest,
    label,
    path: newPath.join('.'),
    ...(children ? { children: addPath(children, newPath) } : {})
  }))
}
function updateValue (arr, value, newValue) {
  return arr.map(({ label, children, path, ...rest }) => ({
    ...rest,
    label: path === value ? newValue : label,
    path,
    ...(children ? { children: updateValue(children, value, newValue) } : {})
  }))
}
function findNode (node, key, value) {
  if (node[key] === value) {
    return node
  }
  for (let i = 0, len = _.keys(node).length; i < len; i++) {
    const child = node[_.keys(node)[i]]
    if (child && _.isObject(child)) {
      const found = findNode(child, key, value)
      if (found) {
        return found
      }
    }
  }
}
</script>
