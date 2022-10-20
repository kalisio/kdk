<template>
  <div class="q-pa-xs row full-width justify-center">
    <img :src="src" />
  </div>
</template>

<script setup>
import _ from 'lodash'
import config from 'config'
import { ref, computed, onMounted } from 'vue'
import { api } from '../../../../core/client/index.js'

// props
const props = defineProps({
  content: {
    type: Object,
    required: true
  }
})

// data
const jwt = ref(null)

// computed
const src = computed (() => {
  const src = props.content.src
  if (!_.startsWith(src, '/api')) return src 
  return src + '?jwt=' + jwt.value
})

// hooks
onMounted(async () => {
  jwt.value = await api.get('storage').getItem(config.apiJwt)
})
</script>
