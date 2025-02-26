<template>
  <q-chip
    v-bind="_.omit(props, ['color', 'textColor', 'label'])"
    @updated:modelValue="state => emit('updated:modelValue', state)"
    @updated:selected="state => emit('updated:selected', state)"
    @remove="emit('remove')"
    @click="event => emit('click', event)"
    class="k-chip"
  >
    <div :id="id" class="ellipsis">
      {{ computedLabel }}
      <q-tooltip v-if="isTruncated">
        {{ computedLabel }}
      </q-tooltip>
    </div>
  </q-chip>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed, watchEffect, nextTick } from 'vue'
import { uid } from 'quasar'
import { i18n } from '../i18n.js'
import { getHtmlColor, getContrastColor } from '../utils'

// Props
const props = defineProps({
  label: {
    type: [String, Number],
    default: ''
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
const computedColor = computed(() => {
  return getHtmlColor(props.color)
})
const computedTextColor = computed(() => {
  if (_.isEmpty(props.textColor)) return getContrastColor(props.color)
  return getHtmlColor(props.textColor)
})

// Watch
watchEffect(async () => {
  // wait for the chip to be rendered
  await nextTick()
  // get the element
  const chipElement = document.getElementById(id)
  // check whether the label is truncated
  isTruncated.value = (chipElement && chipElement.offsetWidth < chipElement.scrollWidth)
})
</script>

<style lang="scss">
.k-chip {
  background-color: v-bind(computedColor);
  color: v-bind(computedTextColor);
}
.q-chip__icon {
  color: v-bind(computedTextColor);
}
</style>
