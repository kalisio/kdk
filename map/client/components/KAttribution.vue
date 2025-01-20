<template>
  <div class="q-pa-sm">
    <KShape
      class="text-weight-bold"
      :options="{
        shape: 'circle',
        color: 'white',
        stroke: {
          color: 'primary',
          width: '2'
        },
        text: {
          label: 'i',
          color: 'primary'
        }
      }"
    />
    <q-popup-proxy
      id="attributions-popup"
      transition-show="scale"
      transition-hide="scale"
      anchor="center left"
      self="bottom right"
    >
      <div
        id="attributions-banner"
        class="bg-white text-primary text-center q-col-gutter-y-xs"
      >
        <!-- Header Content -->
        <div v-if="header">
          <KContent :content="header" :class="headerClass" />
        </div>
        <!-- Main Content -->
        <div
          id="attributions-content"
          v-html="sanitizedAttributions"
          class="text-caption q-py-none q-px-sm"
        />
        <!-- Footer Content -->
        <div v-if="footer">
          <KContent :content="footer" :class="footerClass" />
        </div>
      </div>
    </q-popup-proxy>
  </div>
</template>

<script setup>
import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import { ref, computed, watch } from 'vue'
import { Document } from '../../../core/client/document.js'
import { KShape } from '../../../core/client/components/media'
import { useCurrentActivity } from '../composables'
import KContent from '../../../core/client/components/KContent.vue'

// Data
const { CurrentActivity } = useCurrentActivity({ selection: false, probe: false })
const attributions = ref({})
const header = ref(_.get(config, 'attribution.header', []))
const headerClass = ref(_.get(config, 'attribution.headerClass', ''))
const footer = ref(_.get(config, 'attribution.footer', []))
const footerClass = ref(_.get(config, 'attribution.footerClass', ''))

// Computed
const sanitizedAttributions = computed(() => {
  let content = ''
  _.forOwn(attributions.value, (attribution, layer) => {
    content += `${attribution}<br>`
  })
  return Document.sanitizeHtml(content)
})

// Watch
watch(() => CurrentActivity.value, (newActivity, oldActivity) => {
  if (oldActivity) {
    // remove listeners
    oldActivity.$engineEvents.off('layer-shown', onShowLayer)
    oldActivity.$engineEvents.off('layer-hidden', onHideLayer)
  }
  if (newActivity) {
    // setup attribution
    newActivity.getLayers().forEach((layer) => {
      if (newActivity.isLayerVisible(layer.name)) {
        onShowLayer(layer)
      }
    })
    // install listeners
    newActivity.$engineEvents.on('layer-shown', onShowLayer)
    newActivity.$engineEvents.on('layer-hidden', onHideLayer)
  }
}, { immediate: true })

// Functions
function onShowLayer (layer) {
  if (layer.attribution) {
    logger.debug(`[KDK] Add ${layer.name} to attribution`)
    _.set(attributions.value, _.kebabCase(layer.name), layer.attribution)
  }
}
function onHideLayer (layer) {
  if (layer.attribution) {
    logger.debug(`[KDK] Remove ${layer.name} from attribution`)
    _.unset(attributions.value, _.kebabCase(layer.name))
  }
}
</script>
