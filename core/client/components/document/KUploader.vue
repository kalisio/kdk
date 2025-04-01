<template>
  <q-file
    v-model="files"
    :filter="checkFilesSize"
    :label="$t('KUploader.ADD_FILES')"
    :disable="uploading"
    rounded
    outlined
    use-chips
    multiple
    append
    clearable
    dense
    @update:model-value="onUpdated"
  />
</template>

<script setup>
import _ from 'lodash'
import logger from 'loglevel'
import { ref } from 'vue'
import { Notify } from 'quasar'
import { Storage } from '../../storage.js'
import { i18n } from '../../i18n.js'

// Props
const props = defineProps({
  path: {
    type: String,
    default: undefined
  },
  fileTypes: {
    type: String,
    default: undefined
  },
  maxFileSize: {
    type: Number,
    default: 52428800
  }
})

// Emits
const emit = defineEmits(['files-updated', 'files-uploaded'])

// Data
const files = ref([])
const uploading = ref(false)
const bToMb = 0.00000095367432

// Functions
function checkFilesSize (files) {
  return _.filter(files, file => {
    if (file.size === 0) {
      Notify.create({ type: 'negative', message: i18n.t('KUploader.EMPTY_FILE', { file: file.name }) })
      return false
    }
    if (file.size > props.maxFileSize) {
      Notify.create({ type: 'negative', message: i18n.t('KUploader.FILE_TOO_LARGE', { file: file.name, size: Math.trunc(props.maxFileSize * bToMb) }) })
      return false
    }
    return true
  })
}
async function upload (path) {
  uploading.value = true
  // compute the path: first use path argument, second use path prop
  if (!path) path = _.isEmpty(props.path) ? '' : `${props.path}`
  // upload the files
  for (const file of files.value) {
    const key = _.isEmpty(path) ? file.name : `${path}/${file.name}`
    logger.debug(`[KDK] Uploading file ${file.name} with key ${key}`)
    // check for invalid file
    if (!file.name || !file.type) {
      logger.error(`[KDK] Uploading file ${file.name} failed: File Not Valid`)
      Notify.create({
        type: 'negative',
        message: i18n.t('KUploader.INVALID_TYPE', { file: file.name })
      })
      uploading.value = false
      files.value = []
      onUpdated([])
      return false
    }
    // if file is valid, begin upload
    Storage.upload({
      file: file.name,
      type: file.type,
      key,
      blob: file
    })
      .then(() => {
        Notify.create({
          type: 'positive',
          message: i18n.t('KUploader.UPLOAD_FILE_SUCCEEDED', { file: file.name })
        })
      })
      .catch(error => {
        logger.error(`[KDK] Uploading file ${file.name} failed:`, error)
        Notify.create({
          type: 'negative',
          message: i18n.t('KUploader.UPLOAD_FILE_ERRORED', { file: file.name })
        })
      })
  }
  uploading.value = false
  emit('files-uploaded', files.value)
  // clear the files
  files.value = []
  onUpdated([])
  return true
}
function onUpdated (value) {
  const files = _.map(value, file => {
    return {
      name: file.name,
      type: file.type
    }
  })
  emit('files-updated', files)
}

// Expose
defineExpose({
  upload
})
</script>
