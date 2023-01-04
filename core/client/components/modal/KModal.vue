<template>
  <q-dialog
    ref="modalRef"
    persistent
    :maximized="maximized"
  >
    <q-card
      id="modal-card"
      v-bind:class="{
        'column full-height': maximized,
        'q-pa-sm': $q.screen.gt.xs,
        'q-pa-xs': $q.screen.lt.sm
      }"
      :style="computedStyle">
      <!--
         Header section
       -->
      <div id ="modal-header"
        class="row full-width justify-between items-center"
        v-bind:class="{'q-pa-sm': $q.screen.gt.xs, 'q-pa-xs': $q.screen.lt.sm }"
      >
        <q-resize-observer @resize="onHeaderResized" />
        <div v-if="title" class="ellipsis text-h6">
          {{ $tie(title) }}
        </div>
        <KPanel
          id="modal-toolbar"
          :content="toolbar"
          v-bind:class="{ 'q-gutter-x-sm' : $q.screen.gt.xs, 'q-gutter-x-xs': $q.screen.lt.sm }"
        />
      </div>
      <!--
        Content section
       -->
      <div id="modal-content"
        class="col"
        v-bind:class="{'q-pa-sm': $q.screen.gt.xs, 'q-pa-xs': $q.screen.lt.sm }"
      >
        <KScrollArea class="q-pl-xs q-pr-lg" :maxHeight="scrollAreaMaxHeight">
          <slot />
        </KScrollArea>
      </div>
      <!--
        Footer section
       -->
      <div id="modal-footer" v-if="buttons"
        class="q-pa-sm row full-width justify-end"
        v-bind:class="{'q-pa-sm': $q.screen.gt.xs, 'q-pa-xs': $q.screen.lt.sm }"
      >
        <q-resize-observer @resize="onFooterResized" />
        <KPanel
          id="modal-buttons"
          class="q-gutter-x-sm"
          :content="buttons"
          :action-renderer="'form-button'"
        />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useQuasar } from 'quasar'
import KScrollArea from '../frame/KScrollArea.vue'
import KPanel from '../frame/KPanel.vue'

// Props
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  toolbar: {
    type: Array,
    default: () => null
  },
  buttons: {
    type: Array,
    default: () => null
  },
  maximized: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Data
const $q = useQuasar()
const modalRef = ref(null)
const headerHeight = ref(0)
const footerHeight = ref(0)
const scrollAreaMaxHeight = ref(0)

// Computed
const computedStyle = computed(() => {
  if (props.maximized) return ''
  // compute the modal max height
  const screenHeight = $q.screen.height
  const modalMaxHeight = props.maximized ? screenHeight : 0.8 * screenHeight
  // compute the scroll area max height
  // take into account the header and footer height
  let contentMaxHeight = modalMaxHeight - headerHeight.value
  const cardElement = document.getElementById('modal-card')
  if (cardElement) {
    contentMaxHeight -= parseInt(window.getComputedStyle(cardElement).getPropertyValue('padding-top'))
    contentMaxHeight -= parseInt(window.getComputedStyle(cardElement).getPropertyValue('padding-bottom'))
  }
  const contentElement = document.getElementById('modal-content')
  if (contentElement) {
    contentMaxHeight -= parseInt(window.getComputedStyle(contentElement).getPropertyValue('padding-top'))
    contentMaxHeight -= parseInt(window.getComputedStyle(contentElement).getPropertyValue('padding-bottom'))
  }
  contentMaxHeight -= footerHeight.value
  scrollAreaMaxHeight.value = contentMaxHeight
  // return the style
  if ($q.screen.lt.sm) return `min-width: 100vw; max-height: ${modalMaxHeight}px`
  if ($q.screen.lt.md) return `min-width: 90vw; max-height: ${modalMaxHeight}px`
  if ($q.screen.lt.lg) return `min-width: 80vw; max-height: ${modalMaxHeight}px`
  if ($q.screen.lt.xl) return `min-width: 70vw; max-height: ${modalMaxHeight}px`
  return `min-width: 60vw; max-height: ${modalMaxHeight}px`
})

// Watch
watch(() => props.modelValue, (value) => {
  if (value) modalRef.value.show()
  else modalRef.value.hide()
})

// Functions
function show () {
  modalRef.value.show()
  emit('update:modelValue', true)
}
function hide () {
  modalRef.value.hide()
  emit('update:modelValue', false)
}
function onHeaderResized (size) {
  if (headerHeight.value !== size.height) headerHeight.value = size.height
}
function onFooterResized (size) {
  if (footerHeight.value !== size.height) footerHeight.value = size.height
}

// Expose
defineExpose({
  show,
  hide
})
</script>
