<template>
  <KItem 
    ref="item" 
  >
    <template v-slot:item-content>
      <div 
        class="row items-center no-wrap" 
        :class="{ 'q-gutter-x-sm': dense, 'q-gutter-x-md': !dense }"
      >
        <div class="text-subtitle2">
          {{ name }}
        </div>
        <div 
          class="row item-baseline no-wrap"
          :class="{ 'q-gutter-x-sm': dense, 'q-gutter-x-md': !dense }"
        >
          <KStylePreview :style="pointStyle" type="point" />
          <KStylePreview :style="lineStyle" type="line" />
          <KStylePreview :style="polygonStyle" type="polygon" />
        </div>
      </div>
    </template>
  </KItem>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed } from 'vue'
import KItem from '../../../../core/client/components/collection/KItem.vue'
import KStylePreview from './KStylePreview.vue'

// Props
defineProps({
  dense: Boolean,
  default: false
})

// Data
const item = ref(null)

// Computed
const name = computed(() => {
  return _.get(item.value, 'item.name', '')
})
const pointStyle = computed(() => {
  return _.get(item.value, 'item.point')
})
const lineStyle = computed(() => {
  console.log(_.get(item.value, 'item.line'))
  return _.get(item.value, 'item.line')
})
const polygonStyle = computed(() => {
  console.log(_.get(item.value, 'item.polygon'))
  return _.get(item.value, 'item.polygon')
})
</script>
