<template>
  <div v-if="CurrentActivity" class="q-pa-sm">
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
          <KContent
            :content="header"
            :class="headerClass"
          />
        </div>
        <!-- Main Content -->
        <div
          id="attributions-content"
          v-html="sanitizedAttributions"
          class="text-caption q-py-none q-px-sm"
        />
        <!-- Footer Content -->
        <div v-if="footer">
          <KContent
            :content="footer"
            :class="footerClass"
          />
        </div>
      </div>
    </q-popup-proxy>
  </div>
</template>

<script setup>
import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
import { Document } from '../../../../core/client/document.js'
import { useCurrentActivity } from '../../composables'
import KContent from '../../../../core/client/components/KContent.vue'
import KShape from '../../../../core/client/components/media/KShape.vue'

// Data
const { CurrentActivity } = useCurrentActivity({ selection: false, probe: false })
const attributions = ref({})
const header = ref(_.get(config, 'attribution.header', []))
const headerClass = ref(_.get(config, 'attribution.headerClass', ''))
const footer = ref(_.get(config, 'attribution.footer', []))
const footerClass = ref(_.get(config, 'attribution.footerClass', ''))

// Computed
const sanitizedAttributions = computed(() => {
  const filteredAttributions = _.uniq(_.map(attributions.value))
  let content = _.reduce(filteredAttributions, (content, attribution) => {
    return content += `${attribution}<br>`
  }, '')
  return Document.sanitizeHtml(content)
})

// Functions
function onLayerShown (layer) {
  if (layer.attribution) {
    const key = _.kebabCase(layer.name)
    if (!_.has(attributions.value, key)) {
      logger.debug(`[KDK] Add ${layer.name} to attributions`)
      _.set(attributions.value, key, layer.attribution)
    }
  }
}
function onLayerHidden (layer) {
  if (layer.attribution) {
    logger.debug(`[KDK] Remove ${layer.name} from attributions`)
    _.unset(attributions.value, _.kebabCase(layer.name))
  }
}

// Hooks
onMounted(() => {
  if (CurrentActivity.value) {
    CurrentActivity.value.getLayers().forEach((layer) => {
      if (CurrentActivity.value.isLayerVisible(layer.name)) onLayerShown(layer)
    })
    CurrentActivity.value.$engineEvents.on('layer-shown', onLayerShown)
    CurrentActivity.value.$engineEvents.on('layer-hidden', onLayerHidden)
  }
})
onBeforeUnmount(() => {
  if (CurrentActivity.value) {
    CurrentActivity.value.$engineEvents.off('layer-shown', onLayerShown)
    CurrentActivity.value.$engineEvents.off('layer-hidden', onLayerHidden)
  }
})
</script>
