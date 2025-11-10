<template>
  <q-icon
    v-bind="computedIcon"
    class="k-icon"
  >
    <div
      v-if="computedOverlay"
      class="k-icon-overlay"
    >
      <q-icon v-bind="computedOverlay" />
    </div>
  </q-icon>
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'
import { getHtmlColor } from '../../utils'

// Props
const props = defineProps({
  icon: {
    type: [String, Object],
    default: undefined
  }
})

// Data
const defaultColor = 'grey-9'

// Computed
const computedIcon = computed(() => {
  if (!props.icon) return
  if (_.isString(props.icon)) return { name: props.icon }
  return _.omit(props.icon, ['overlay', 'color'])
})
const computedIconColor = computed(() => {
  if (!props.icon) return
  if (_.isString(props.icon)) return defaultColor
  return getHtmlColor(props.icon.color, defaultColor)
})
const computedOverlay = computed(() => {
  return _.omit(_.get(props.icon, 'overlay', {}), ['color', 'rotation'])
})
const computedOverlayColor = computed(() => {
  return getHtmlColor(_.get(props.icon, 'overlay.color', defaultColor))
})
const computedOverlayTransform = computed(() => {
  return `rotate(${_.get(props.icon, 'overlay.rotation', 0)}deg)`
})
</script>

<style lang="scss" scoped>
.k-icon {
  position: relative;
  color: v-bind(computedIconColor);
}
.k-icon-overlay {
  position: absolute;
  color: v-bind(computedOverlayColor);
  transform: v-bind(computedOverlayTransform);
}
</style>
