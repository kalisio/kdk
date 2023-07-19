<template>
  <q-tree
    :nodes="props.nodes"
    :label-key="props.labelKey"
    :node-key="props.nodeKey"
    @lazy-load="onLazyLoad"
  ></q-tree>
</template>

<script setup>

const props = defineProps({
  nodes: {
    type: Array,
    default: []
  },
  labelKey: {
    type: String,
    default: 'label'
  },
  nodeKey: {
    type: String,
    default: 'id'
  },
  onLazyLoad: {
    type: Function,
    default: 'onLazyLoad'
  }
})

</script>
