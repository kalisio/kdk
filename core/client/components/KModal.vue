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
      <div id="modal-content" class="full-width col">
        <KScrollArea
          v-if="scrollable"
          :maxHeight="scrollAreaMaxHeight"
          class="q-pl-xs q-pr-md"
        >
          <slot />
        </KScrollArea>
        <slot v-else />
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
import { ref, computed, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import KScrollArea from './KScrollArea.vue'
import KPanel from './KPanel.vue'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
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
  widthPolicy: {
    type: String,
    default: 'medium',
    validator: (value) => {
      return ['wide', 'medium', 'narrow'].includes(value)
    }
  },
  maximized: {
    type: Boolean,
    default: false
  },
  scrollable: {
    type: Boolean,
    default: true
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
const xsMinWidths = { wide: 100, medium: 100, narrow: 85 }
const smMinWidths = { wide: 96, medium: 90, narrow: 65 }
const mdMinWidths = { wide: 94, medium: 78, narrow: 45 }
const lgMinWidths = { wide: 92, medium: 65, narrow: 35 }
const xlMinWidths = { wide: 90, medium: 55, narrow: 25 }

// Computed
const computedStyle = computed(() => {
  // compute the modal max height
  const screenHeight = $q.screen.height
  const modalMaxHeight = props.maximized ? screenHeight : 0.9 * screenHeight
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
  if ($q.screen.lt.sm) return `min-width: ${xsMinWidths[props.widthPolicy]}vw; max-height: ${modalMaxHeight}px`
  if ($q.screen.lt.md) return `min-width: ${smMinWidths[props.widthPolicy]}vw; max-height: ${modalMaxHeight}px`
  if ($q.screen.lt.lg) return `min-width: ${mdMinWidths[props.widthPolicy]}vw; max-height: ${modalMaxHeight}px`
  if ($q.screen.lt.xl) return `min-width: ${lgMinWidths[props.widthPolicy]}vw; max-height: ${modalMaxHeight}px`
  return `min-width: ${xlMinWidths[props.widthPolicy]}vw; max-height: ${modalMaxHeight}px;`
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

// Hooks
onMounted(() => {
  if (props.modelValue) modalRef.value.show()
})

// Expose
defineExpose({
  show,
  open: show,
  hide,
  close: hide
})
</script>
