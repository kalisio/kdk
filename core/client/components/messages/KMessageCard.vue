<template>
  <q-card bordered class="no-shadow">
    <!-- Message content -->
    <div v-bind:class="{ 'q-px-sm q-py-xs': dense, 'q-px-md q-py-sm': !dense }">
      <KTextArea :text="item.body" :minHeight="44" :dense="true" />
    </div>
    <!-- Message attachments -->
    <div
      v-if="hasAttachments"
      v-bind:class="{ 'q-px-sm q-py-xs': dense, 'q-px-md q-py-sm': !dense }"
      class="full-width row justify-start items-center"
    >
      <template v-for="attachment in attachments" :key="attachment.name">
        <q-chip :label="attachment.name" size="0.8rem" clickable>
          <q-popup-proxy
            auto-close
            anchor="top middle"
            self="bottom middle"
            :breakpoint="300"
          >
            <div class="bg-grey-8 row items-center q-gutter-x-sm no-wrap">
              <KAction
                v-if="canViewAttachment(attachment)"
                id="view-attachment"
                icon="las la-eye"
                label="MessageCard.VIEW_ATTACHMENT"
                color="white"
                :handler="() => viewAttachment(attachment)"
              />
              <q-separator
                v-if="canViewAttachment(attachment)"
                vertical
                class="bg-grey-7"
              />
              <KAction
                id="download-attachment"
                icon="las la-download"
                label="MessageCard.DOWNLOAD_ATTACHMENT"
                color="white"
                :handler="() => downloadAttachment(attachment)"
              />
            </div>
          </q-popup-proxy>
        </q-chip>
      </template>
    </div>
  </q-card>
</template>

<script>
import {
  Document,
  Storage,
  composables as kdkCoreComposables,
  mixins as kdkCoreMixins
} from '@kalisio/kdk/core.client'
import _ from 'lodash'
import KTextArea from '../KTextArea.vue'

export default {
  mixins: [kdkCoreMixins.baseItem],
  components: {
    KTextArea
  },
  computed: {
    attachments () {
      const files = _.get(this.item, 'attachments', [])
      _.forEach(files, (file) => {
        file.key = `messages/${this.item._id}/${file.name}`
      })
      return files
    },
    hasAttachments () {
      return !_.isEmpty(this.attachments)
    }
  },
  methods: {
    canViewAttachment (attachment) {
      return Document.hasViewer(attachment.type)
    },
    async viewAttachment (attachment) {
      this.$q.dialog({
        component: 'KDialog',
        componentProps: {
          component: 'document/KBrowser',
          'component.path': `messages/${this.item._id}`,
          'component.documents': _.filter(this.attachments, (document) => {
            return Document.hasViewer(document.type)
          }),
          'component.default': attachment.name,
          'component.toolbar': ['download'],
          maximized: true,
          scrollable: false,
          backgroundColor: 'dark',
          textColor: 'grey-3',
          okAction: 'CLOSE'
        }
      })
    },
    downloadAttachment (attachment) {
      const key = `messages/${this.item._id}/${attachment.name}`
      Storage.export({ file: attachment.name, key, context: this.contextId })
    }
  },
  setup () {
    // data
    const { dense } = kdkCoreComposables.useScreen()
    // expose
    return { dense }
  }
}
</script>
