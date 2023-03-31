<template>
  <KTree :nodes="store" />
</template>

<script setup>
import _ from 'lodash'
import moment from 'moment'
import { Store } from '..'
import { computed } from 'vue'
import KTree from './KTree'

const store = computed(() => convertStore(Store))

function convertStore (obj) {
  let id = 0

  const traverse = (node) => {
    return _.keys(node).map(key => {
      const child = node[key]
      id++

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
          id: id,
          label: key,
          children: traverse(Object.assign({}, child))
        }
      }
      if (_.isObject(child)) {
        return {
          id: id,
          label: key,
          children: traverse(child)
        }
      }
      return {
        id: id,
        label: key,
        children: [{ label: child, children: [] }]
      }
    })
  }
  return traverse(obj)
}
</script>
