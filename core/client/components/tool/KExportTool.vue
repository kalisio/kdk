<template>
  <KAction
    id="export-tool"
    :tooltip="title"
    icon="las la-download"
    :handler="onTriggered"
  />
</template>

<script setup>
import { runExport } from '../../utils/utils.export.js'
import KAction from '../KAction.vue'

// props
const props = defineProps({
  title: {
    type: String,
    default: undefined
  },
  service: {
    type: String,
    required: true
  },
  context: {
    type: String,
    default: undefined
  },
  query: {
    type: Object,
    default: {}
  },
  formats: {
    type: [String, Array],
    default: [
      { label: 'CSV', value: 'csv' },
      { label: 'JSON', value: 'json' }
    ]
  },
  gzip: {
    type: Boolean,
    default: false
  }
})

// Functions
async function onTriggered () {
  await runExport(props)
}
</script>