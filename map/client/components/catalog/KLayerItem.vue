<template>
  <div :id="id" class="full-width row items-center q-px-sm no-wrap">
    <!-- Layer toggle -->
    <q-toggle v-if="togglable"
      v-model="layer.isVisible"
      :disable="layer.isDisabled"
      size="xs"
      @update:modelValue="onToggled"
    />
    <!-- Layer name -->
    <div
      class="row ellipsis-2-lines"
      :class="{
        'text-primary': layer.isVisible,
        'text-grey-6': layer.isDisabled
      }"
    >
      <span v-html="label" />
      <q-badge v-if="layer.badge" v-bind="layer.badge">
        <q-icon v-if="layer.badge.icon" v-bind="layer.badge.icon" />
      </q-badge>
      <q-tooltip
        v-if="(layer.tooltip || layer.description) && $q.platform.is.desktop" :delay="1000"
        anchor="center left"
        self="center right"
        :offset="[20, 0]">
        {{ layer.tooltip || layer.description }}
      </q-tooltip>
    </div>
    <q-space />
    <q-icon name="las la-exclamation-circle" size="sm" color="warning" v-if="layer.isDisabled">
      <q-tooltip>{{ $t('KLayersSelector.LAYER_DISABLED') }}</q-tooltip>
    </q-icon>
    <!-- Layer actions -->
    <KPanel
      :id="`${layer.name}-actions`"
      :content="layer.actions"
      :context="layer"
      :filter="{ id: { $nin: ['toggle', 'toggle-filter'] } }"
    />
  </div>
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'
import { Document } from '../../../../core/client/document.js'
import { KPanel } from '../../../../core/client/components'

// Props
const props = defineProps({
  layer: {
    type: Object,
    default: () => {}
  },
  togglable: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['toggled'])

// Computed
const id = computed(() => {
  const name = _.kebabCase(_.get(props.layer, 'name'))
  if (_.startsWith(name, 'layers-')) return name
  return 'layers-' + name
})
const label = computed(() => {
  const label = _.get(props.layer, 'label')
  return Document.sanitizeHtml(label || _.get(props.layer, 'name'))
})

// Functions
function onToggled () {
  emit('toggled', props.layer)
}
</script>
