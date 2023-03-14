<template>
  <div class="q-pa-md q-gutter-sm">
    <q-tree
      :nodes="props.nodes"
      node-key="label"
    ></q-tree>
  </div>
</template>

<script setup>

const props = defineProps({
  nodes: {
    type: Array,
    default: []
  }
})

</script>
