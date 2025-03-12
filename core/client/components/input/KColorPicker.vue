<template>
  <div>
    <q-btn
      id="color-picker"
      :size="size"
      round
      :style="{ 'background-color': color }"
    />
    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
      <q-color
        v-model="color"
        :no-header-tabs="noHeaderTabs"
        :no-footer="noFooter"
        :format-model="formatModel"
        :default-view="defaultView"
      />
    </q-popup-proxy>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { getHtmlColor } from '../../utils'

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: '#FF0000'
  },
  formatModel: {
    type: String,
    default: 'hex'
  },
  noHeaderTabs: {
    type: Boolean,
    default: true
  },
  noFooter: {
    type: Boolean,
    default: false
  },
  defaultView: {
    type: String,
    default: 'palette',
    validator: (value) => {
      return ['spectrum', 'tune', 'palette'].includes(value)
    }
  },
  size: {
    type: String,
    default: 'sm'
  }
})

// Emit
const emit = defineEmits(['update:modelValue'])
const color = ref(null)

// Watch
watch(() => props.modelValue, (value) => {
  color.value = getHtmlColor(value)
}, { immediate: true })
watch(color, newColor => {
  emit('update:modelValue', newColor)
})

</script>
