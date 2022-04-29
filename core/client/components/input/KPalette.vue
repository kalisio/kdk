<template>
  <div class="row justify-start q-gutter-sm full-width">
    <template v-for="(color, index) in colors">
      <div :key="index">
        <q-btn v-bind:id="'style-color-' + color" :key="index" :round="shape === 'round'" :icon="value === color ? 'las la-check' : ''" small :color="color" @click="$emit('input', color)">
        </q-btn>
      </div>
    </template>
  </div>
</template>

<script>
import { Colors } from '../../utils'

export default {
  name: 'k-palette',
  props: {
    value: {
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
