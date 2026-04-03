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
import * as math from 'mathjs'
import { computed, watch, onMounted } from 'vue'
import { uid } from 'quasar'
import { Units } from '../../units.js'
import { buildColorScale } from '../../utils/utils.colors'

// props
const props = defineProps({
  label: {
    type: String,
    default: undefined
  },
  colors: {
    type: [String, Array],
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
  unit: {
    type: String,
    default: undefined
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
          color: 'black',
          format: { notation: 'auto', precision: 3 }
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

// Data
const canvasId = uid()
let canvas = null
let canvasContext = null
let expectedSize = null
const callRefresh = _.debounce(() => { refresh() }, 200)

// Computed
const labelText = computed(() => {
  let text = props.label
  if (text && props.unit) text += ` (${Units.getUnitSymbol(props.unit)})`
  return text
})
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
  return _.get(props.layout, 'ticks.size', 10)
})
const ticksFont = computed(() => {
  return ticksSize.value + 'px ' + _.get(props.layout, 'ticks.font', 'Arial')
})
const ticksColor = computed(() => {
  return _.get(props.layout, 'ticks.color', 'black')
})
const ticksFormat = computed(() => {
  return _.get(props.layout, 'ticks.format', { notation: 'auto', precision: 3 })
})
const gutter = computed(() => {
  return _.get(props.layout, 'gutter', 4)
})
const reversed = computed(() => {
  return _.get(props.domain, '[1]', 1) < _.get(props.domain, '[0]', 0)
})

// Functions
function formatTick (tick, previousTick) {
  return (typeof ticksFormat.value === 'function' ? ticksFormat.value({ tick, previousTick }) : math.format(tick, ticksFormat.value))
}
function normalize (x, domain) {
  return Math.min(1, Math.max(0, (x - domain[0]) / (domain[domain.length - 1] - domain[0])))
}
function drawLabel () {
  if (_.isNil(labelText.value)) return
  canvasContext.font = labelFont.value
  canvasContext.fillStyle = labelColor.value
  canvasContext.textAlign = labelAlign.value
  let xLabel = canvas.width
  switch (labelAlign.value) {
    case 'left':
      xLabel = 0
      break
    case 'center':
      xLabel = canvas.width / 2
      break
    default:
  }
  canvasContext.fillText(labelText.value, xLabel, labelSize.value)
}
function drawDiscreteHorizontalScale () {
  drawLabel()
  // draw colorbar
  const yBar = _.isNil(props.label) ? 0 : labelSize.value + gutter.value
  const length = props.classes.length - 1
  const boxWidth = canvas.width / length
  const colorScale = buildColorScale(props)
  for (let i = 0; i < length; i++) {
    canvasContext.fillStyle = colorScale(props.classes[i])
    canvasContext.fillRect(i * boxWidth, yBar, boxWidth, barHeight.value)
  }
  // draw ticks
  const yTicks = yBar + barHeight.value + gutter.value + ticksSize.value
  canvasContext.font = ticksFont.value
  canvasContext.fillStyle = ticksColor.value
  let previousTickValue
  for (let i = 0; i < props.classes.length; ++i) {
    let tickValue
    if (i === 0) {
      if (props.classes[i] !== Number.MIN_VALUE) {
        canvasContext.textAlign = 'left'
        tickValue = props.classes[i]
      }
    } else if (i === props.classes.length - 1) {
      if (props.classes[i] !== Number.MAX_VALUE) {
        canvasContext.textAlign = 'right'
        tickValue = props.classes[i]
      }
    } else {
      canvasContext.textAlign = 'center'
      tickValue = props.classes[i]
    }
    if (!_.isNil(tickValue)) {
      const tick = formatTick(tickValue, previousTickValue)
      // Tick to be displayed or not ?
      if (tick) {
        canvasContext.fillText(tick, i * boxWidth, yTicks)
        previousTickValue = tickValue
      }
    }
  }
}
function drawDiscreteVerticalScale () {
  drawLabel()
  // draw colorbar
  const yBar = _.isNil(props.label) ? 0 : labelSize.value + gutter.value
  const length = props.classes.length - 1
  const boxHeight = (canvas.height - yBar) / length
  const colorScale = buildColorScale(props)
  for (let i = 0; i < length; i++) {
    canvasContext.fillStyle = colorScale(props.classes[i])
    canvasContext.fillRect(0, yBar + (length - i - 1) * boxHeight, barWidth.value, boxHeight)
  }
  // draw ticks
  canvasContext.font = ticksFont.value
  canvasContext.fillStyle = ticksColor.value
  canvasContext.textAlign = 'left'
  const x = barWidth.value + gutter.value
  let previousTickValue
  for (let i = 0; i < props.classes.length; ++i) {
    let tickValue
    if (i === 0) {
      if (props.classes[i] !== Number.MIN_VALUE) tickValue = props.classes[i]
    } else if (i === props.classes.length - 1) {
      if (props.classes[i] !== Number.MAX_VALUE) tickValue = props.classes[i]
    } else {
      tickValue = props.classes[i]
    }
    if (!_.isNil(tickValue)) {
      const tick = formatTick(tickValue, previousTickValue)
      // Tick to be displayed or not ?
      if (tick) {
        canvasContext.fillText(tick, x, yBar + (length - i) * boxHeight + ticksSize.value / 2)
        previousTickValue = tickValue
      }
    }
  }
}
function drawContinuousHorizontalScale () {
  drawLabel()
  // draw colorbar
  const yBar = _.isNil(props.label) ? 0 : labelSize.value + gutter.value
  const length = canvas.width
  const colors = buildColorScale(props).colors(length)
  if (reversed.value) colors.reverse()
  for (let i = 0; i < length; i++) {
    canvasContext.fillStyle = colors[i]
    canvasContext.fillRect(i, yBar, 1, barHeight.value)
  }
  // draw ticks
  const yTicks = yBar + barHeight.value + gutter.value + ticksSize.value
  canvasContext.font = ticksFont.value
  canvasContext.fillStyle = ticksColor.value
  const domain = (reversed.value ? props.domain.toReversed() : props.domain)
  let previousTickValue
  for (let i = 0; i < domain.length; ++i) {
    const tickValue = domain[i]
    if (i === 0) {
      canvasContext.textAlign = 'left'
    } else if (i === domain.length - 1) {
      canvasContext.textAlign = 'right'
    } else {
      canvasContext.textAlign = 'center'
    }
    if (!_.isNil(tickValue)) {
      const tick = formatTick(tickValue, previousTickValue)
      // Tick to be displayed or not ?
      if (tick) {
        canvasContext.fillText(tick, normalize(tickValue, domain) * length, yTicks)
        previousTickValue = tickValue
      }
    }
  }
}
function drawContinuousVerticalScale () {
  drawLabel()
  // draw colorbar
  const yBar = _.isNil(props.label) ? 0 : labelSize.value + gutter.value
  const length = canvas.height - yBar
  const colors = buildColorScale(props).colors(length)
  if (reversed.value) colors.reverse()
  for (let i = 0; i < length; i++) {
    canvasContext.fillStyle = colors[i]
    canvasContext.fillRect(0, yBar + length - i, barWidth.value, 1)
  }
  // draw ticks
  canvasContext.font = ticksFont.value
  canvasContext.fillStyle = ticksColor.value
  const x = barWidth.value + gutter.value
  canvasContext.textAlign = 'left'
  const domain = (reversed.value ? props.domain.toReversed() : props.domain)
  let previousTickValue
  for (let i = 0; i < domain.length; ++i) {
    let tickValue
    if (i === 0) {
      if (domain[i] !== Number.MIN_VALUE) tickValue = domain[i]
    } else if (i === domain.length - 1) {
      if (domain[i] !== Number.MAX_VALUE) tickValue = domain[i]
    } else {
      tickValue = domain[i]
    }
    if (!_.isNil(tickValue)) {
      const tick = formatTick(tickValue, previousTickValue)
      // Tick to be displayed or not ?
      if (tick) {
        canvasContext.fillText(tick, x, yBar + normalize(tickValue, domain) * length + ticksSize.value / 2)
        previousTickValue = tickValue
      }
    }
  }
}
function refresh () {
  if (!canvas || !expectedSize) return
  if (canvas.width !== expectedSize.width) canvas.width = expectedSize.width
  if (canvas.height !== expectedSize.height) canvas.height = expectedSize.height
  canvasContext.clearRect(0, 0, canvas.width, canvas.height)
  canvasContext.fillText(props.label, canvas.width / 2, labelFont.value)
  if (props.classes) {
    if (props.direction === 'horizontal') drawDiscreteHorizontalScale()
    else drawDiscreteVerticalScale()
  } else {
    if (props.direction === 'horizontal') drawContinuousHorizontalScale()
    else drawContinuousVerticalScale()
  }
}
function onResized (size) {
  expectedSize = size
  if (canvas) callRefresh()
}

// Watch
watch(props, () => { if (canvas) callRefresh() })

// Hooks
onMounted(() => {
  canvas = document.getElementById(canvasId)
  canvasContext = canvas.getContext('2d')
  refresh()
})
</script>

<style lang="scss" scoped>
  .k-color-scale {
    width: 100%;
  }
</style>
