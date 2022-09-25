<template>
  <div>
    <q-resize-observer @resize="onResized" />
    <canvas class="fit" :id="canvasId" />
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, onMounted } from 'vue'
import { uid } from 'quasar'
import chroma from 'chroma-js'

// props
const props = defineProps({
  colors: {
    type: String,
    default: 'OrRd'
  },
  domain: {
    type: Array,
    default: () => [0 , 1]
  },
  classes: {
    type: Array,
    default: () => null
  },
  size: {
    type: Number,
    default: 16
  },
  fontSize: {
    type: Number,
    default: 8
  },
  fontColor: {
    type: String,
    default: 'black'
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
const callRefresh = _.debounce((size) => { refresh(size) }, 50)
const margin = 2

// functions
function drawDiscreteHorizontalScale () {
  // draw colorbar
  const classToColor = chroma.scale(props.colors).classes(props.classes)
  const length = props.classes.length - 1
  const boxWidth = canvas.value.width / length
  for (let i = 0; i < length; i++) {
    context.value.fillStyle = classToColor(props.classes[i])
    context.value.fillRect(i * boxWidth, 0, boxWidth, props.size)  
  }
  // draw ticks
  context.value.font = `${props.fontSize}px`
  context.value.fillStyle = `${props.fontColor}` 
  const y = props.size + margin + props.fontSize
  for (let i = 0; i < props.classes.length; ++i) {
    let tick = undefined
    if (i === 0) {
      if (props.classes[i] !== Number.MIN_VALUE) {
        context.value.textAlign = 'left'
        tick = props.classes[i]
      }
    } else if (i === props.classes.length -1) {
      if (props.classes[i] !== Number.MAX_VALUE) {
        context.value.textAlign = 'right'
        tick = props.classes[i]
      }
    } else {
      context.value.textAlign = 'center'
      tick = props.classes[i]
    }
    if (tick) context.value.fillText(tick, i * boxWidth, y)
  }
}
function drawDiscreteVerticalScale () {
  // draw colorbar
  const classToColor = chroma.scale(props.colors).classes(props.classes)
  const length = props.classes.length - 1
  const boxHeight = canvas.value.height / length
   for (let i = 0; i < length; i++) {
    context.value.fillStyle = classToColor(props.classes[i])
    context.value.fillRect(0, (length - i - 1) * boxHeight, props.size, boxHeight)  
  }
  // draw ticks
  context.value.font = `${props.fontSize}px`
  context.value.fillStyle = `${props.fontColor}`
  context.value.textAlign = 'left'
  const x = props.size + margin
  for (let i = 0; i < props.classes.length; ++i) {
    let tick = undefined
    if (i === 0) {
      if (props.classes[i] !== Number.MIN_VALUE) tick = props.classes[i]
    } else if (i === props.classes.length -1) {
      if (props.classes[i] !== Number.MAX_VALUE) tick = props.classes[i]
    } else tick = props.classes[i]
    if (tick) context.value.fillText(tick, x, (length - i) * boxHeight + props.fontSize / 2)
  }
}
function drawContinuousHorizontalScale () {
  // draw colorbar
  const length = canvas.value.width
  const colors = chroma.scale(props.colors).colors(length)
  for (let i = 0; i < length; i++) {
    context.value.fillStyle = colors[i]
    context.value.fillRect(i, 0, 1, props.size)
  }
  // draw ticks
  context.value.font = `${props.fontSize}px`
  context.value.fillStyle = `${props.fontColor}`
  const y = props.size + margin + props.fontSize
  context.value.textAlign = 'left'
  context.value.fillText(props.domain[0], 0, y)
  context.value.textAlign = 'right'
  context.value.fillText(props.domain[1], canvas.value.width, y)
}
function drawContinuousVerticalScale () {
  // draw colorbar
  const length = canvas.value.height
  const colors = chroma.scale(props.colors).colors(length)
  for (let i = 0; i < length; i++) {
    context.value.fillStyle = colors[i]
    context.value.fillRect(0, length - i, props.size, 1)
  }
  // draw ticks
  context.value.font = `${props.fontSize}px`
  context.value.fillStyle = `${props.fontColor}`
  const x = props.size + margin
  context.value.textAlign = 'left'
  context.value.fillText(props.domain[0], x, canvas.value.height)
  context.value.fillText(props.domain[1], x, props.fontSize)
}
function refresh(size) {
  canvas.value.width = size.width
  canvas.value.height = size.height
  if (props.classes) {
    if (props.direction === 'horizontal') drawDiscreteHorizontalScale()
    else drawDiscreteVerticalScale()
  } else {
    if (props.direction === 'horizontal') drawContinuousHorizontalScale()
    else drawContinuousVerticalScale()
  }
}
function onResized (size) {
  if (canvas.value) callRefresh(size)
}

// hooks
onMounted(() => {
  canvas.value = document.getElementById(canvasId)
  context.value = canvas.value.getContext("2d")
})
</script>