<template>
  <div class="fit column">
    <div v-if="interactive === true" class="fit" style="position: relative;">
      <pinch-zoom
        class="pinch-zoom-controller fit row justify-center items-center"
        @change="onTransformed"
      >
        <img
          :src="url"
          :onload="onLoaded"
          style="max-width: 100%;"
        />
      </pinch-zoom>
      <div
        v-if="transformed"
        class="bg-grey-9 k-toolbar"
      >
        <KAction
          id="restore-image"
          icon="las la-compress-arrows-alt"
          label="KImage.RESET"
          color="white"
          :handler="reset"
        />
      </div>
    </div>
    <div v-else class="fit row justify-center items-center">
      <img
        :src="url"
        :onload="onLoaded"
        style="max-width: 100%;"
      />
    </div>
    <q-spinner
      class="absolute-center"
      v-if="loading"
      color="white"
      size="3em"
    />
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed } from 'vue'
import 'pinch-zoom-element/dist/pinch-zoom.js'
import { DefaultZIndex } from '../../layout.js'
import KAction from '../action/KAction.vue'

// Props
const props = defineProps({
  url: {
    type: String,
    default: ''
  },
  options: {
    type: Object,
    default: () => {
      return {
        interactive: true
      }
    }
  }
})

// Emit
const emit = defineEmits(['image-transformed'])

// Data
const loading = ref(true)
const transformed = ref(false)
const toolbarZIndex = DefaultZIndex.stickies

// Computed
const interactive = computed(() => {
  return _.get(props.options, 'interactive', true)
})

// Functions
function reset () {
  const controller = document.querySelector('.pinch-zoom-controller')
  if (controller) {
    controller.setTransform({
      scale: 1,
      x: 0,
      y: 0,
      allowChangeEvent: true
    })
    transformed.value = false
  }
}
function onTransformed () {
  transformed.value = true
  emit('image-transformed')
}
function onLoaded () {
  loading.value = false
}
</script>

<style lang="scss" scoped>
.k-toolbar {
  position: absolute;
  bottom: 16px;
  left: 50%; transform: translate(-50%, 0);
  border-radius: 24px;
  z-index: v-bind(toolbarZIndex);
}
</style>
