<template>
  <q-chip
    v-if="object"
    :key="computedLabel"
    :color="computedColor"
    text-color="white"
    dense
    outline
    square>
    <q-icon
      v-if="computedIcon"
      :name="computedIcon"
      class="q-mr-xs"
    />
    <div :id="computedId" class="ellipsis">
      {{ computedLabel }}
      <q-tooltip v-if="hasTooltip">
        {{ computedLabel }}
      </q-tooltip>
    </div>
  </q-chip>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed, watchEffect, nextTick } from 'vue'
import { i18n } from '../../i18n.js'
import { getIconName } from '../../utils'

// Props
const props = defineProps({
  object: {
    type: Object,
    default: () => null
  },
  labelPath: {
    type: String,
    default: 'value'
  }
})

// Data
const hasTooltip = ref(false)

// Computed
const computedId = computed(() => {
  return _.kebabCase(computedLabel.value)
})
const computedLabel = computed(() => {
  return _.get(props.object, props.labelPath, i18n.t('UNAMED'))
})
const computedIcon = computed(() => {
  return getIconName(props.object)
})
const computedColor = computed(() => {
  return _.get(props.object, 'icon.color', 'black')
})

// Watch
watchEffect(async () => {
  // wait for the chip to be rendered
  await nextTick()
  // get the element
  const chipElement = document.getElementById(computedId.value)
  // check whether the label is truncated
  hasTooltip.value = (chipElement && chipElement.offsetWidth < chipElement.scrollWidth)
})
</script>
