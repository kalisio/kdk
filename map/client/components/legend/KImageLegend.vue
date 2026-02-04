<template>
  <KLegendRenderer
    v-if="content"
    :label="label"
    :labelClass="labelClass"
  >
    <!-- content -->
    <div class="k-image-legend">
      <img :src="src"  />
    </div>
  </KLegendRenderer>
</template>

<script setup>
import _ from 'lodash'
import config from 'config'
import { ref, computed, onMounted } from 'vue'
import { api } from '../../../../core/client/index.js'
import KLegendRenderer from './KLegendRenderer.vue'

// props
const props = defineProps({
  label: {
    type: String,
    default: undefined
  },
  labelClass: {
    type: String,
    default: undefined
  },
  content: {
    type: Object,
    default: () => null
  }
})

// data
const jwt = ref(null)

// computed
const src = computed(() => {
  const src = props.content.src
  if (!_.startsWith(src, '/api')) return src
  return src + '?jwt=' + jwt.value
})

// hooks
onMounted(async () => {
  jwt.value = await api.get('storage').getItem(config.apiJwt)
})
</script>

<style lang="scss" scoped>
.k-image-legend {
  text-align: center;
}
</style>
