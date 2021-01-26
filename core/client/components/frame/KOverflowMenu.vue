<template>
  <q-btn v-if="!empty" id="overflow-menu-entry" icon="las la-ellipsis-v" flat round :dense="$q.screen.lt.md">
    <q-menu id="overflow-menu" auto-close>
      <k-panel id="menu-entries" :content="content" :mode="mode" :context="context" direction="vertical" action-renderer="item" />
    </q-menu>
  </q-btn>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'k-overflow-menu',
  props: {
    content: {
      type: [Object, Array],
      default: () => { return null }
    },
    mode: {
      type: String,
      default: () => { return undefined }
    },
    context: {
      type: Object,
      default: () => { return null }
    }
  },
  computed: {
    empty () {
      return _.isEmpty(this.content)
    }
  },
  created () {
    // load the required components
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
  }
}
</script>
