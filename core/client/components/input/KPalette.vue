<template>
  <div class="row justify-start q-gutter-sm full-width">
    <template v-for="(color, index) in colors" :key="index">
      <q-btn 
        :round="shape === 'round'" 
        :icon="modelValue === color ? 'las la-check' : ''" 
        :color="color" 
        small
        @click="$emit('update:modelValue', color)" />
    </template>
  </div>
</template>

<script>
import { Colors } from '../../utils.js'

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
