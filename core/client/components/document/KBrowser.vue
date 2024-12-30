<template>
  <div 
    class="fit column"
    :class="{ 'bg-dark text-grey-3': dark }"
  >
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
        <KStamp v-else
          icon="las la-eye-slash"
          icon-size="3rem"
          :text="$t('KBrowser.CANNOT_BE_VIEWED')"
          direction="vertical"
          class="q-pa-md"
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

          :handler="next"
        />
      </div>
    </div>
    <KStamp v-else
      icon="las la-exclamation-circle"
      icon-size="4rem"
      :text="$t('KBrowser.NO_FILES')"
      text-size="1rem"
      direction="vertical"
      class="fixed-center"
    />
  </div>
</template>

<script setup>
import _ from 'lodash'
import logger from 'loglevel'
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { Dialog } from 'quasar'
import { Storage } from '../../storage.js'
import { Events } from '../../events.js'
import { Document } from '../../document.js'
import { i18n } from '../../i18n.js'
import KDocument from './KDocument.vue'
import KAction from '../action/KAction.vue'
import KStamp from '../KStamp.vue'

// Props
const props = defineProps({
  contextId: {
    type: String,
    default: undefined
  },
  path: {
    type: String,
    default: undefined
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
  },
  dark: {
    type: Boolean,
    default: true
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
  if (props.toolbar.includes('download') && file.value) {
    components.push({
      id: 'download-file',
      icon: 'las la-download',
      color: props.dark ? 'grey-3' : 'grey-8',
      tooltip: 'KBrowser.DOWNLOAD_FILE',
      handler: downloadFile
    })
  }
  if (props.toolbar.includes('upload')) {
    components.push({
      id: 'upload-file',
      icon: 'las la-upload',
      color: props.dark ? 'grey-3' : 'grey-8',
      tooltip: 'KBrowser.UPLOAD_FILES',
      dialog: {
        component: 'document/KUploader',
        'component.contextId': props.contextId,
        'component.path': props.path,
        cancelAction: 'CANCEL',
        okAction: { id: 'upload-button', label: 'KBrowser.UPLOAD', handler: 'upload' }
      }
    })
  }
  if (props.toolbar.includes('delete') && file.value) {
    components.push({
      id: 'delete-file',
      icon: 'las la-trash',
      color: props.dark ? 'grey-3' : 'grey-8',
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
  logger.debug('[KDK] Browser refreshed', files.value, index.value)
  file.value = files.value[index.value]
  file.value.url = await Storage.getPresignedUrl({
    key: getDocumentKey(file.value.name),
    context: props.contextId,
    expiresIn: 60
  })
}
function downloadFile () {
  Storage.export({
    file: file.value.name,
    key: getDocumentKey(file.value.name),
    context: props.contextId
  })
}
function deleteFile () {
  Dialog.create({
    message: i18n.t('KBrowser.DELETE_FILE_MESSAGE', { name: file.value.name }),
    persistent: true,
    ok: {
      label: i18n.t('YES'),
      flat: true
    },
    cancel: {
      label: i18n.t('NO'),
      flat: true
    }
  }).onOk(() => {
    Storage.remove({
      file: file.value.name,
      key: getDocumentKey(file.value.name),
      context: props.contextId
    })
  })
}
async function onFileUploaded (data) {
  const { name, key, type, context } = data
  logger.debug(`[KDK] File ${name} of type ${type} uploaded:`, key, context)
  // filter event
  if (context !== props.contextId) return
  if (!key.includes(props.path)) return
  // add the file
  files.value.push({ name, type })
  // refresh the browser
  if (index.value === -1) {
    index.value = 0
    await refresh()
  }
}
async function onFileRemoved (data) {
  const { name, key, context } = data
  logger.debug(`[KDK] File ${name} removed:`, key, context)
  // filter event
  if (context !== props.contextId) return
  if (!key.includes(props.path)) return
  // remove the file
  _.remove(files.value, file => {
    return file.name === name
  })
  // refresh the browser
  if (_.size(files.value) === 0) {
    file.value = null
    index.value = -1
  } else {
    if (index.value < _.size(files.value) - 1) index.value = index.value + 1
    else index.value = 0
    await refresh()
  }
}

// Hooks
onMounted(() => {
  Events.on('file-uploaded', onFileUploaded)
  Events.on('file-removed', onFileRemoved)
})
onBeforeUnmount(() => {
  Events.off('file-uploaded', onFileUploaded)
  Events.off('file-removed', onFileRemoved)
})
</script>
