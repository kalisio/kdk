<template>
  <KCard
    v-bind="$props"
    :header="computedHeader"
    :sections="sections"
    :footer="computedFooter"
    :dense="dense"
  >
    <template v-slot:card-heading v-if="computedHeader || computedHeading">
      <!-- Message actions -->
      <div class="full-width row">
        <div :class="{ 'col-12': dense, 'col-8': !dense }">
          <div class="full-width row justify-between">
            <slot name="card-heading">
              <!-- name -->
              <div
                class="text-subtitle1 text-weight-medium ellipsis-2-lines"
                v-bind:class="{ 'q-py-xs': dense, 'q-py-sm': !dense }"
              >
                <KPanel
                  v-if="computedHeading"
                  id="card-heading-panel"
                  :content="computedHeading"
                  :context="$props"
                  class="full-width no-wrap"
                />
                <template v-else>
                  {{ item.name }}
                </template>
              </div>
            </slot>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:card-content>
      <!-- Message content -->
      <div v-bind:class="{ 'q-py-xs': dense, 'q-py-sm': !dense }">
        <KTextArea :text="item.body" :minHeight="44" :dense="true" />
      </div>
    </template>
    <template v-slot:card-footer v-if="hasAttachments || computedFooter">
      <q-separator />
      <!-- Message attachments -->
      <div
        v-bind:class="{ 'q-px-sm q-py-xs': dense, 'q-px-md q-py-sm': !dense }"
        class="full-width row justify-start items-center"
      >
        <template
          v-if="hasAttachments"
          v-for="attachment in attachments"
          :key="attachment.name"
        >
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
                  label="KMessageCard.VIEW_ATTACHMENT"
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
                  label="KMessageCard.DOWNLOAD_ATTACHMENT"
                  color="white"
                  :handler="() => downloadAttachment(attachment)"
                />
              </div>
            </q-popup-proxy>
          </q-chip>
        </template>
        <KPanel
          v-if="computedFooter"
          id="card-footer-panel"
          :content="computedFooter"
          :context="$props"
          class="q-ml-auto"
        />
      </div>
    </template>
  </KCard>
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
import KCard from '../collection/KCard.vue'

export default {
  mixins: [kdkCoreMixins.baseItem],
  props: {
    header: {
      type: [Array, Object],
      default: () => null
    },
    sections: {
      type: Object,
      default: () => null
    },
    footer: {
      type: [Array, Object],
      default: () => null
    },
    dense: {
      type: Boolean,
      default: false
    },
    canEditMessageFn: {
      type: Function,
      default: (message) => null
    },
    canRemoveMessageFn: {
      type: Function,
      default: (message) => null
    }
  },
  components: {
    KCard,
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
    },
    computedHeader () {
      return _.filter(this.itemActions, { scope: 'header' })
    },
    computedHeading () {
      return _.filter(this.itemActions, { scope: 'heading' })
    },
    computedFooter () {
      return _.filter(this.itemActions, { scope: 'footer' })
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
    },
    canEditMessage () {
      if (this.canEditMessageFn === null) return this.$can('update', 'messages')
      return this.canEditMessageFn(this.item)
    },
    canRemoveMessage () {
      if (this.canRemoveMessageFn === null) return this.$can('remove', 'messages')
      return this.canRemoveMessageFn(this.item)
    }
  },
  setup () {
    // data
    const { dense } = kdkCoreComposables.useScreen()
    // expose
    return {
      dense
    }
  }
}
</script>
