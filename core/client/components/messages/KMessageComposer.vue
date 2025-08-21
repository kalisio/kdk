<template>
  <div class="column">
    <!--
      Header
     -->
    <div class="row justify-between items-center no-wrap">
      <div :class="{ 'q-pa-xs': $q.screen.xs, 'q-pa-sm': $q.screen.gt.xs, 'col-auto': true }">
        <q-fab
          id="composer-fab"
          :icon="getKindIcon(currentType)"
          :color="getKindColor(currentType)"
          direction="up"
          :vertical-actions-align="$q.screen.lt.md ? 'left' : 'center'"
          padding="xs"
        >
          <template v-for="type in availableTypes" :key="type">
            <q-fab-action
              :icon="getKindIcon(type)"
              :color="getKindColor(type)"
              :label="getKindLabel(type)"
              padding="xs"
              @click="currentType = type"
            />
          </template>
        </q-fab>
        <KAction
          id="format-message"
          :icon="editor ? 'las la-sms' : 'las la-edit'"
          :tooltip="
            editor
              ? 'KMessageComposer.CLOSE_EDITOR'
              : 'KMessageComposer.OPEN_EDITOR'
          "
          :handler="
            () => {
              editor = !editor
            }
          "
        />
      </div>
      <slot name="header"></slot>
    </div>
    <!--
      Editor
     -->
    <div class="q-pa-sm full-width col">
      <q-editor
        v-if="editor"
        :placeholder="$t('KMessageComposer.WRITE_YOUR_MESSAGE')"
        v-model="body"
        :toolbar="editorToolbar"
        toolbar-bg="grey-2"
        min-height="3rem"
        flat
        dense
      />
      <q-input
        v-else
        :placeholder="$t('KMessageComposer.WRITE_YOUR_MESSAGE')"
        v-model="body"
        autogrow
        borderless
        dense
        @keydown.enter.prevent="sendMessage"
      />
    </div>
    <!--
      Actions
     -->
    <div class="q-pa-sm full-width row items-center q-gutter-sm no-wrap">
      <KUploader
        ref="uploaderRef"
        :path="`messages`"
        class="col"
        :maxFileSize="props.maxFileSize"
        @files-updated="onUploaderUpdated"
      />
      <KAction
        id="send-message"
        icon="send"
        tooltip="KMessageComposer.SEND_MESSAGE"
        :disabled="!hasBody || !canSendMessage"
        :handler="sendMessage"
        color="primary"
        renderer="fab"
      />
    </div>
  </div>
</template>

<script setup>
import config from 'config'
import _ from 'lodash'
import logger from 'loglevel'
import { Notify, useQuasar } from 'quasar'
import { computed, ref } from 'vue'
import { i18n } from '../../i18n.js'
import { Store } from '../../store.js'
import { useMessages } from '../../composables/index.js'
import KUploader from '../document/KUploader.vue'

// Props
const props = defineProps({
  messageTypes: {
    type: Object,
    default: null
  },
  baseMessage: {
    type: Object,
    required: false
  },
  maxFileSize: {
    type: Number,
    default: 52428800
  },
  canSendMessage: {
    type: Boolean,
    default: true
  }
})

// Data
const $q = useQuasar()
const User = Store.get('user')
const MessageTypes = props.messageTypes ?? config.messagesActivity.messages
const { createMessage } = useMessages()
const editor = ref(false)
const uploaderRef = ref(null)
const attachments = ref(null)
const currentType = ref(_.head(_.keys(MessageTypes)))
const body = ref('')

// Computed
const availableTypes = computed(() => {
  return _.difference(_.keys(MessageTypes), [currentType.value])
})
const editorToolbar = computed(() => {
  return [
    ['bold', 'italic', 'underline', 'strike', 'unordered', 'ordered'],
    ['quote', 'link', 'hr']
  ]
})
const hasBody = computed(() => {
  return !_.isEmpty(body.value)
})

// Function
function getKindIcon (type) {
  return MessageTypes[type].icon
}
function getKindColor (type) {
  return MessageTypes[type].color
}
function getKindLabel (type) {
  return i18n.t(MessageTypes[type].label)
}
function onUploaderUpdated (content) {
  logger.debug('[KDK] Uploader content updated:', content)
  attachments.value = content
}
async function sendMessage () {
  if (_.isEmpty(body.value)) return
  // define the message
  const message = {
    type: currentType.value,
    body: body.value,
    author: _.get(User, 'profile.name'),
    attachments: attachments.value
  }
  if (props.baseMessage) _.merge(message, props.baseMessage)
  // check for invalid file type
  if (
    !_.isEmpty(attachments.value) &&
    (_.some(attachments.value, (file) => !file.type) ||
      _.some(attachments.value, (file) => !file.name))
  ) {
    console.error('Invalid file type')
    Notify.create({
      type: 'negative',
      message: i18n.t('KUploader.INVALID_TYPE')
    })
    return
  }
  // create the message
  const result = await createMessage(message)
  // upload the files
  if (!_.isEmpty(attachments.value)) {
    const path = `messages/${result._id}`
    uploaderRef.value.upload(path)
  }
  // refresh the interface
  currentType.value = _.head(_.keys(MessageTypes))
  body.value = ''
}

defineExpose({
  currentType
})
</script>
