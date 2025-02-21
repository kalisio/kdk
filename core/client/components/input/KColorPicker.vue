<template>
  <div>
    <q-btn id="style-point-color" round style="max-width: 16px" :style="{ 'background-color': color }"/>
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
    default: 'spectrum',
    validator: (value) => {
      return ['spectrum', 'tune', 'palette', 'swatches'].includes(value)
    }
  }
})

const emit = defineEmits(['update:modelValue'])
const color = ref(props.modelValue)

watch(color, newColor => {
  emit('update:modelValue', newColor)
})

</script>
