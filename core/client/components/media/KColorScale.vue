<template>
  <div>
    <q-resize-observer @resize="onResized" />
    <canvas 
      class="k-color-scale" 
      :id="canvasId" 
      />
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed, watchEffect, onMounted } from 'vue'
import { uid } from 'quasar'
import chroma from 'chroma-js'

// props
const props = defineProps({
  label: {
    type: String,
    default: undefined
  },
  colors: {
    type: String,
    default: 'OrRd'
  },
  domain: {
    type: Array,
    default: () => [0, 1]
  },
  classes: {
    type: Array,
    default: () => null
  },
  layout: {
    type: Object,
    default: () => {
      return {
        gutter: 4,
        label: {
          size: 12,
          font: 'Arial',
          color: 'black',
          align: 'left'
        },
        bar: {
          height: undefined,
          width: undefined
        },
        ticks: {
          size: 10,
          font: 'Arial',
          color: 'black'
        }
      }
    }
  },
  direction: {
    type: String,
    default: 'horizontal',
    validator: (value) => {
      return ['horizontal', 'vertical'].includes(value)
    }
  }
})

// data
const canvasId = uid()
const canvas = ref(null)
const context = ref(null)
const expectedSize = ref({ width: 250, height: 46 })
const callRefresh = _.debounce(() => { refresh() }, 200)

// computed
const labelSize = computed(() => {
  return _.get(props.layout, 'label.size', 12)
})
const labelFont = computed(() => {
  return labelSize.value + 'px ' + _.get(props.layout, 'label.font', 'Arial')
})
const labelColor = computed(() => {
  return _.get(props.layout, 'label.color', 'black')
})
const labelAlign = computed(() => {
  return _.get(props.layout, 'label.align', 'left')
})
const barHeight = computed(() => {
  return _.get(props.layout, 'bar.height', props.direction === 'horizontal' ? 16 : undefined)
})
const barWidth = computed(() => {
  return _.get(props.layout, 'bar.width', props.direction === 'vertical' ? 16 : undefined)
})
const ticksSize = computed(() => {
  return _.get(props.layout, 'ticks.size', 8)
})
const ticksFont = computed(() => {
  return ticksSize.value + 'px ' + _.get(props.layout, 'ticks.font', 'Arial')
})
const ticksColor = computed(() => {
  return _.get(props.layout, 'ticks.color', 'black')
})
const gutter = computed(() => {
  return _.get(props.layout, 'gutter', 4)
})
// functions
function drawLabel () {
  if (_.isNil(props.label)) return
  context.value.font = labelFont.value
  context.value.fillStyle = labelColor.value
  context.value.textAlign = labelAlign.value
  let xLabel = canvas.value.width
  switch (labelAlign.value) {
    case 'left':
      xLabel = 0
      break
    case 'center':
      xLabel = canvas.value.width / 2
      break
    default:
  }
  context.value.fillText(props.label, xLabel, labelSize.value)
}
function drawDiscreteHorizontalScale () {
  drawLabel()
  // draw colorbar
  const yBar = _.isNil(props.label) ? 0 : labelSize.value + gutter.value
  const length = props.classes.length - 1
  const boxWidth = canvas.value.width / length
  const classToColor = chroma.scale(props.colors).classes(props.classes)
  for (let i = 0; i < length; i++) {
    context.value.fillStyle = classToColor(props.classes[i])
    context.value.fillRect(i * boxWidth, yBar, boxWidth, barHeight.value)
  }
  // draw ticks
  const yTicks = yBar + barHeight.value + gutter.value + ticksSize.value
  context.value.font = ticksFont.value
  context.value.fillStyle = ticksColor.value
  for (let i = 0; i < props.classes.length; ++i) {
    let tick
    if (i === 0) {
      if (props.classes[i] !== Number.MIN_VALUE) {
        context.value.textAlign = 'left'
        tick = props.classes[i]
      }
    } else if (i === props.classes.length - 1) {
      if (props.classes[i] !== Number.MAX_VALUE) {
        context.value.textAlign = 'right'
        tick = props.classes[i]
      }
    } else {
      context.value.textAlign = 'center'
      tick = props.classes[i]
    }
    if (tick) context.value.fillText(tick, i * boxWidth, yTicks)
  }
}
function drawDiscreteVerticalScale () {
  drawLabel()
  // draw colorbar
  const yBar = _.isNil(props.label) ? 0 : labelSize.value + gutter.value
  const length = props.classes.length - 1
  const boxHeight = (canvas.value.height - yBar) / length
  const classToColor = chroma.scale(props.colors).classes(props.classes)
  for (let i = 0; i < length; i++) {
    context.value.fillStyle = classToColor(props.classes[i])
    context.value.fillRect(0, yBar + (length - i - 1) * boxHeight, barWidth.value, boxHeight)
  }
  // draw ticks
  context.value.font = ticksFont.value
  context.value.fillStyle = ticksColor.value
  context.value.textAlign = 'left'
  const x = barWidth.value + gutter.value
  for (let i = 0; i < props.classes.length; ++i) {
    let tick
    if (i === 0) {
      if (props.classes[i] !== Number.MIN_VALUE) tick = props.classes[i]
    } else if (i === props.classes.length - 1) {
      if (props.classes[i] !== Number.MAX_VALUE) tick = props.classes[i]
    } else tick = props.classes[i]
    if (tick) context.value.fillText(tick, x, yBar + (length - i) * boxHeight + ticksSize.value / 2)
  }
}
function drawContinuousHorizontalScale () {
  drawLabel()
  // draw colorbar
  const yBar = _.isNil(props.label) ? 0 : labelSize.value + gutter.value
  const length = canvas.value.width
  const colors = chroma.scale(props.colors).colors(length)
  for (let i = 0; i < length; i++) {
    context.value.fillStyle = colors[i]
    context.value.fillRect(i, yBar, 1, barHeight.value)
  }
  // draw ticks
  const yTicks = yBar + barHeight.value + gutter.value + ticksSize.value
  context.value.font = ticksFont.value
  context.value.fillStyle = ticksColor.value
  context.value.textAlign = 'left'
  context.value.fillText(props.domain[0], 0, yTicks)
  context.value.textAlign = 'right'
  context.value.fillText(props.domain[1], canvas.value.width, yTicks)
}
function drawContinuousVerticalScale () {
  drawLabel()
  // draw colorbar
  const yBar = _.isNil(props.label) ? 0 : labelSize.value + gutter.value
  const length = canvas.value.height - yBar
  const colors = chroma.scale(props.colors).colors(length)
  for (let i = 0; i < length; i++) {
    context.value.fillStyle = colors[i]
    context.value.fillRect(0, yBar + length - i, barWidth.value, 1)
  }
  // draw ticks
  context.value.font = ticksFont.value
  context.value.fillStyle = ticksColor.value
  const x = barWidth.value + gutter.value
  context.value.textAlign = 'left'
  context.value.fillText(props.domain[0], x, canvas.value.height)
  context.value.fillText(props.domain[1], x, yBar + ticksSize.value)
}
function refresh () {
  if (!canvas.value) return
  if (canvas.value.width !== expectedSize.value.width) canvas.value.width = expectedSize.value.width
  if (canvas.value.height !== expectedSize.value.height) canvas.value.height = expectedSize.value.height
  context.value.clearRect(0, 0, canvas.value.width, canvas.value.height)
  context.value.fillText(props.label, canvas.value.width / 2, labelFont.value)
  if (props.classes) {
    if (props.direction === 'horizontal') drawDiscreteHorizontalScale()
    else drawDiscreteVerticalScale()
  } else {
    if (props.direction === 'horizontal') drawContinuousHorizontalScale()
    else drawContinuousVerticalScale()
  }
}
function onResized (size) {
  expectedSize.value = size
  if (canvas.value) callRefresh()
}

// watch
watchEffect(() => {
  if (canvas.value) refresh()
})

// hooks
onMounted(() => {
  canvas.value = document.getElementById(canvasId)
  context.value = canvas.value.getContext('2d')
  refresh()
})
</script>

<style lang="scss" scoped>
  .k-color-scale {
    width: 100%;
  }
</style>
