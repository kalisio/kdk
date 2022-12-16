<template>
  <KModal
    ref="dialogRef"
    :title="title"
    :maximized="maximized"
    :buttons="computedButtons"
  >
    <component 
      ref="componentRef"
      :is="computedComponent" 
      v-bind="attrs"
    />
  </KModal>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed, useAttrs } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import { loadComponent } from '../../utils'
import KModal from '../modal/KModal.vue'

// Props
const props = defineProps({
  title: {
    type: String,
    default: undefined
  },
  component: {
    type: String,
    default: null
  },
  okAction: {
    type: [String, Object],
    default: 'OK'
  },
  cancelAction: {
    type: [String, Object],
    default: undefined
  },
  maximized: {
    type: Boolean,
    default: false
  }
})

// Emits
defineEmits([...useDialogPluginComponent.emits])

// Data
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const componentRef = ref()
const attrs = useAttrs()

// Computed
const computedButtons = computed(() => {
  const buttons = []
  if (!_.isEmpty(props.cancelAction)) {
    if (typeof props.cancelAction === 'string') {
      buttons.push({
        id: 'cancel-action',
        label: props.cancelAction,
        outline: true,
        renderer: 'form-button',
        handler: onDialogCancel
      })
    } else {
      const cancelButton = _.clone(props.cancelAction)
      if (cancelButton.handler) {
        cancelButton.handler = () => {
          cancelButton.handler()
          onDialogCancel()
        }
      }
    }
  }
  if (typeof props.okAction === 'string') {
    buttons.push({
      id: 'ok-action',
      label: props.okAction,
      renderer: 'form-button',
      handler: onDialogOK
    })
  } else {
    const okButton = _.clone(props.okAction)
    if (okButton.handler) {
      // overload the handler to call Quasar onDialogOK
      okButton.handler = () => {
        // ! call the origonal handler to avoid recurcive call 
        if (props.okAction.handler(componentRef)) onDialogOK()
      }
    }
    buttons.push(okButton)
  }
  return buttons
})
const computedComponent = computed(() => {
  return loadComponent(props.component)
})
</script>
