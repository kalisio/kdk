<template>
  <div class="row justify-center q-gutter-xs full-width">
    <template v-for="(color, index) in colors" :key="index">
      <q-btn
        :id="'style-color-' + color"
        :round="shape === 'round'"
        :icon="modelValue === color ? 'las la-check' : ''"
        :color="color"
        :text-color="color === 'white' ? 'black' : 'white'"
        small
        @click="$emit('update:modelValue', color)" />
    </template>
  </div>
</template>

<script>
import { Colors } from '../../utils/utils.colors.js'

export default {
  name: 'k-palette',
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      type: String,
      default: 'dark'
    },
    shape: {
      type: String,
      default: 'square',
      validator: (value) => {
        return ['round', 'square'].includes(value)
      }
    }
  },
  data () {
    return {
      colors: Object.keys(Colors)
    }
  }
}
</script>
