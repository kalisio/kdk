<template>
  <div class="fit column bg-black">
    <div class="full-width row justify-between items-center">
      <div
        v-if="document"
        class="text-subtitle1"
      >

        {{ document.name }}
      </div>
    </div>
    <div class="full-width col row justify-between items-center">
      <div
        v-if="hasPrevious"
        class="full-height column justify-center"
      >
        <KAction
          id="previous-button"
          icon="las la-angle-left"
          size="1rem"
          :handler="previous"
        />
      </div>
      <div class="full-height col column justify-center items-center">
        <KDocument
          v-bind="document"
          :localize="false"
          class="fit"
        />
      </div>
      <div
        v-if="hasNext"
        class="full-height column justify-center"
      >
        <KAction
          id="next-button"
          icon="las la-angle-right"
          size="1rem"
          :handler="next"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed, watch } from 'vue'
import { Storage } from '../../storage.js'
import KDocument from './KDocument.vue'
import KAction from '../action/KAction.vue'

// Props
const props = defineProps({
  documents: {
    type: Array,
    default: () => null
  },
  default: {
    type: String,
    default: undefined
  }
})

// Data
const index = ref(null)
const document = ref(null)

// Computed
const hasPrevious = computed(() => {
  return _.size(props.documents) > 1
})
const hasNext = computed(() => {
  return _.size(props.documents) > 1
})

// Watch
watch(() => [props.documents, props.default], async () => {
  console.log('[DEBUG] Props changed')
  index.value = _.findIndex(props.documents, { name: props.default })
  if (index.value > -1) await refresh()
}, { immediate: true })

// Functions
async function previous () {
  if (index.value === 0) index.value = _.size(props.documents) - 1
  else index.value = index.value - 1
  await refresh()
}
async function next () {
  if (index.value === _.size(props.documents) - 1) index.value = 0
  else index.value = index.value + 1
  await refresh()
}
async function refresh () {
  document.value = props.documents[index.value]
  document.value.url = await Storage.getPresignedUrl({
    key: document.value.key,
    context: document.value.contextId,
    expiresIn: 60
  })
}
</script>
