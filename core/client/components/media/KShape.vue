<template>
  <svg :width="width" :height="height" style="display:block">
    <circle
      v-if="type === 'circle'"
      :cx="width/2"
      :cy="height/2"
      :r="(Math.min(height, width)/2)-borderWidth"
      class="k-shape"
    />
    <ellipse
      v-if="type === 'ellipse'"
      :cx="width/2"
      :cy="height/2"
      :rx="(width/2)-borderWidth"
      :ry="(height/2)-borderWidth"
      class="k-shape"
    />
    <rect
      v-if="type === 'rect'"
      :x="borderWidth"
      :y="borderWidth"
      :width="width-(2*borderWidth)"
      :height="height-(2*borderWidth)"
      :rx="borderRadius"
      :ry="borderRadius"
      class="k-shape"
    />
    <polygon
      v-if="type === 'triangle-up'"
      :points="`${width/2},${borderWidth} ${borderWidth},${height-borderWidth} ${width-borderWidth},${height-borderWidth}`"
      class="k-shape"
    />
    <polygon
      v-if="type === 'triangle-down'"
      :points="`${width/2},${height-borderWidth} ${borderWidth},${borderWidth} ${width-borderWidth},${borderWidth}`"
      class="k-shape"
    />
    <polygon
      v-if="type === 'triangle-right'"
      :points="`0,0 0,${height} ${width},${height/2}`"
      class="k-shape"
    />
    <polygon
      v-if="type === 'triangle-left'"
      :points="`0,${(height-borderWidth)/2} ${width-borderWidth},${height-borderWidth} ${width-borderWidth},${borderWidth}`"
      class="k-shape"
    />
    <polygon
      v-if="type === 'diamond'"
      :points="`${width/2},${height-borderWidth} ${width-borderWidth},${height/2} ${width/2},${borderWidth} ${borderWidth},${height/2}`"
      class="k-shape"
    />
  </svg>
  <q-tooltip v-if="tooltip">
    {{ tooltip }}
  </q-tooltip>
</template>

<script setup>
import { getCssVar } from 'quasar'

// props
defineProps({
  type: {
    type: String,
    default: 'circle',
    validator: (value) => {
      return ['circle', 'ellipse', 'rect', 'triangle-up', 'triangle-down', 'triangle-right', 'triangle-left', 'diamond'].includes(value)
    }
  },
  width: {
    type: Number,
    default: 18
  },
  height: {
    type: Number,
    default: 18
  },
  color: {
    type: String,
    default: getCssVar('primary')
  },
  opacity: {
    type: Number,
    default: 1
  },
  borderColor: {
    type: String,
    default: 'black'
  },
  borderWidth: {
    type: Number,
    default: 1
  },
  borderRadius: {
    type: Number,
    default: 0
  },
  dashArray: {
    type: String,
    default: ''
  },
  tooltip: {
    type: String,
    default: null
  }
})
</script>

<style lang="scss" scoped>
.k-shape {
  fill: v-bind(color);
  fill-opacity: v-bind(opacity);
  stroke: v-bind(borderColor);
  stroke-width: v-bind(borderWidth);
  stroke-dasharray: v-bind(dashArray);
}
</style>
