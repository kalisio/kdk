<template>
  <div v-if="logo">
    <q-img
      :src="logo"
      :width="width"
      :height="height"
      fit="scale-down"
    />
  </div>
</template>

<script setup>
import _ from 'lodash'
import config from 'config'
import { ref } from 'vue'

// Data
const logo = ref(_.get(config, 'appLogo'))

// Props
defineProps({
  width: {
    type: String,
    default: '300px'
  },
  height: {
    type: String,
    default: '100px'
  }
})
</script>
