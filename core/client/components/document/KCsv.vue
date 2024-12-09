<template>
  <q-scroll-area class="fit">
    <table v-if="data">
      <template v-for="(row, index) in data" :key="index">
        <tr>
        <template v-for="cell in row" :key="cell">
          <td>{{ cell }}</td>
        </template>
        </tr>
      </template>
    </table>
  </q-scroll-area>
</template>

<script setup>
import { ref, watch } from 'vue'
import Papa from 'papaparse'
import { Document } from '../../document.js'

// Props
const props = defineProps({
  url: {
    type: String,
    default: null
  },
  localize: {
    type: Boolean,
    default: true
  },
  options: {
    type: Object,
    default: () => null
  }
})

// Data
const data = ref(null)

// Watch
watch(() => props.url, async (value) => {
  const response = await Document.fetchUrl(value, props.localize)
  if (response?.ok) {
    const csv = await response.text()
    data.value = Papa.parse(csv, props.options).data
  } else data.value = null
}, { immediate: true })
</script>

<style lang="scss">
td {
  padding-left: 4px;
  padding-right: 4px;
}
</style>
