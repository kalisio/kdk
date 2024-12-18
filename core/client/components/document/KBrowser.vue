<template>
  <div class="fit column">
    <!--
      Header
     -->
    <div class="full-width row justify-between items-center">
      <div
        id="browser-title"
        class="text-subtitle1"
      >
        {{ title }}
      </div>
      <KPanel
        id="browser-toolbar"
        :content="tools"
        :class="{ 'q-gutter-x-sm' : $q.screen.gt.xs, 'q-gutter-x-xs': $q.screen.lt.sm }"
      />
    </div>
    <!--
      Content
     -->
    <div
      v-if="files && file"
      class="full-width col row justify-between items-center"
    >
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
          v-if="hasDocumentViewer(file)"
          v-bind="file"
          :localize="false"
          class="fit"
        />
        <q-icon
          v-else
          name="las la-eye-slash"
          size="3rem"
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
import { Document } from '../../document.js'
import KDocument from './KDocument.vue'
import KAction from '../action/KAction.vue'

// Props
const props = defineProps({
  path: {
    type: String,
    default: ''
  },
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
const files = ref([])
const file = ref(null)

// Computed
const title = computed(() => {
  return file.value ? file.value.name : ''
})
const hasPrevious = computed(() => {
  return _.size(files.value) > 1
})
const hasNext = computed(() => {
  return _.size(files.value) > 1
})
const tools = computed(() => {
  if (_.isEmpty(props.toolbar)) return []
  const components = []
  if (props.toolbar.includes('download')) {
    components.push({
      id: 'download-file',
      icon: 'las la-download',
      color: 'white',
      tooltip: 'KBrowser.DOWNLOAD_FILE',
      handler: downloadFile
    })
  }
  if (props.toolbar.includes('upload')) {
    components.push({
      id: 'upload-file',
      icon: 'las la-upload',
      color: 'white',
      tooltip: 'KBrowser.UPLOAD_FILES',
      dialog: {
        component: 'document/KUploader',
        'component.path': props.path,
        handlers: { 'files-uploaded': onFilesUploaded },
        cancelAction: 'CANCEL',
        okAction: { id: 'upload-button', label: 'KBrowser.UPLOAD', handler: 'upload' }
      }
    })
  }
  if (props.toolbar.includes('delete')) {
    components.push({
      id: 'delete-file',
      icon: 'las la-trash',
      color: 'white',
      tooltip: 'KBrowser.DELETE_FILE',
      handler: deleteFile
    })
  }
  return components
})

// Watch
watch(() => [props.documents, props.default], async () => {
  if (_.size(props.document) > 0) {
    files.value = props.documents
    index.value = _.findIndex(files.value, { name: props.default })
    if (index.value < 0) index.value = 0
    await refresh()
  } else {
    files.value = []
    file.value = null
    index.value = -1
  }
  files.value = props.documents
  index.value = _.findIndex(files.value, { name: props.default })
  if (index.value > -1) await refresh()
  console.log(files.value)
}, { immediate: true })

// Functions
function hasDocumentViewer (file) {
  return Document.hasViewer(file.type)
}
function getDocumentKey (name) {
  return _.isEmpty(props.path) ? name : `${props.path}/${name}`
}
async function previous () {
  if (index.value === 0) index.value = _.size(files.value) - 1
  else index.value = index.value - 1
  await refresh()
}
async function next () {
  if (index.value === _.size(files.value) - 1) index.value = 0
  else index.value = index.value + 1
  await refresh()
}
async function refresh () {
  file.value = files.value[index.value]
  file.value.url = await Storage.getPresignedUrl({
    key: getDocumentKey(file.value.name),
    expiresIn: 60
  })
}
function downloadFile () {
  Storage.export({
    file: file.value.name,
    key: getDocumentKey(file.value.name)
  })
}
function deleteFile () {
  /* Storage.export({
    file: file.value.name,
    key: getDocumentKey(file.value.name)
  }) */
}
function onFilesUploaded (uploadedFiles) {
  files.value = _.concat(files.value, _.map(uploadedFiles, file => {
    return {
      name: file.name,
      type: file.type
    }
  }))
  console.log(uploadedFiles, files.value)
}
</script>
