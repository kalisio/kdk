<template>
  <div class="fit column">
    <!--
      Header
     -->
    <div class="full-width row justify-between items-center">
      <div
        v-if="document"
        id="browser-title"
        class="text-subtitle1"
      >
        {{ document.name }}
      </div>
      <KPanel
        id="browser-toolbar"
        :content="toolbar"
        :class="{ 'q-gutter-x-sm' : $q.screen.gt.xs, 'q-gutter-x-xs': $q.screen.lt.sm }"
      />
    </div>
    <!--
      Content
     -->
    <div class="full-width col row justify-between items-center">
      <div
        v-if="hasPrevious"
        class="full-height column justify-center"
      >
        <KAction
          id="previous-button"
          icon="las la-angle-left"
          :size="$q.screen.gt.xs ? '1rem' : '0.8rem'"
          color="white"
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
          :size="$q.screen.gt.xs ? '1.2rem' : '0.8rem'"
          color="white"
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
  },
  toolbar: {
    type: Array,
    default: () => null
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
/* TODO
function download (document) {
  Storage.export({
    file: document.value.name,
    key: document.value.key,
    context: document.value.contextId
  })
}*/
</script>
