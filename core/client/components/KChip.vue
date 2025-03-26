<template>
  <q-chip
    v-bind="_.omit(props, ['color', 'textColor', 'label', 'outline'])"
    @updated:modelValue="state => emit('updated:modelValue', state)"
    @updated:selected="state => emit('updated:selected', state)"
    @remove="emit('remove')"
    @click="event => emit('click', event)"
    class="k-chip"
  >
    <div v-if="computedLabel"
      :id="id"
      class="ellipsis"
      :class="{ 'q-pl-sm': !dense && icon, 'q-pl-xs': dense && icon }"
    >
      {{ computedLabel }}
      <q-resize-observer @resize="onResize" />
    </div>
    <q-tooltip v-if="computedTooltip">
      <div v-html="Document.sanitizeHtml(computedTooltip)" />
    </q-tooltip>
    <slot />
  </q-chip>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed } from 'vue'
import { uid } from 'quasar'
import { i18n } from '../i18n.js'
import { Document } from '../document.js'
import { getHtmlColor, getContrastColor } from '../utils'

// Props
const props = defineProps({
  label: {
    type: [String, Number],
    default: ''
  },
  tooltip: {
    type: String,
    default: undefined
  },
  icon: {
    type: String,
    default: undefined
  },
  iconRight: {
    type: String,
    default: undefined
  },
  iconRemove: {
    type: String,
    default: 'cancel'
  },
  iconSelected: {
    type: String,
    default: 'check'
  },
  modelValue: {
    type: Boolean,
    default: true
  },
  selected: {
    type: Boolean,
    default: false
  },
  color: {
    type: String,
    default: 'grey-7'
  },
  textColor: {
    type: String,
    default: undefined
  },
  size: {
    type: String,
    default: 'md'
  },
  dense: {
    type: Boolean,
    default: false
  },
  square: {
    type: Boolean,
    default: false
  },
  outline: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  },
  removable: {
    type: Boolean,
    default: false
  },
  disable: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'update:selected', 'remove', 'click'])

// Data
const isTruncated = ref(false)
const id = uid()

// Computed
const computedLabel = computed(() => {
  return i18n.tie(props.label)
})
const computedTooltip = computed(() => {
  if (props.tooltip) return i18n.tie(props.tooltip)
  if (props.label && isTruncated.value) return computedLabel.value
})
const computedColor = computed(() => {
  return props.outline ? 'transparent' : getHtmlColor(props.color)
})
const computedTextColor = computed(() => {
  if (_.isEmpty(props.textColor)) {
    if (props.outline) return computedBorderColor.value
    return getContrastColor(props.color)
  }
  return getHtmlColor(props.textColor)
})
const computedBorderColor = computed(() => {
  return props.outline ? getHtmlColor(props.color) : 'transparent'
})

// Function
function onResize () {
  // check whether the label is truncated
  const chipElement = document.getElementById(id)
  if (chipElement) isTruncated.value = (chipElement && chipElement.offsetWidth < chipElement.scrollWidth)
}
</script>

<style lang="scss">
.k-chip {
  background-color: v-bind(computedColor);
  color: v-bind(computedTextColor);
}
.q-chip {
  border: solid 1px v-bind(computedBorderColor);
}
.q-chip__icon {
  color: v-bind(computedTextColor);
}
</style>
