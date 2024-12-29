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
const appSlug = _.get(config, 'appSlug', _.kebabCase(_.get(config, 'appName')))
const logo = _.get(config, 'appLogo', `${appSlug}-logo.png`)

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
