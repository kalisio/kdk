<template>
  <div class="q-pa-md q-gutter-sm">
    <q-tree
      :nodes="props.nodes"
      :label-key="props.labelKey"
      :node-key="props.nodeKey"           
    ></q-tree>
  </div>
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
})

</script>
