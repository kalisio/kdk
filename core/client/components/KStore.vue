<template>
  <div class="q-pa-md q-gutter-sm">
    <KTree :nodes="lazy" node-key="path" @lazy-load="onLazyLoad"/>
  </div>
</template>

<script setup>
import _ from 'lodash'
import moment from 'moment'
import { Store } from '..'
import { ref } from 'vue'
import KTree from './KTree'

// Data
const lazy = ref(addPath(convertStore(Store, 1)))

// functions
function onLazyLoad ({ node, key, done, fail }) {
  setTimeout(() => {
    done(convertStore(_.get(Store, key), 1))
    lazy.value = addPath(lazy.value)
  }, 1000)
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
        children: convertStore(Object.assign({}, child), maxDepth , depth )
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
      children: [{ label: child, children: [] }]
    }
  })
}

function addPath (items, path = []) {
  return items.map (({label, children, ...rest}, _, __, newPath = [...path, label]) => ({
    ... rest, 
    label,
    path: newPath.join ('.'),
    ... (children ? {children: addPath(children, newPath)} : {})
  }))
}

</script>
