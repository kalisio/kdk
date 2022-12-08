<template>
  <KModal
    ref="dialogRef"
    :title="title"
    :maximized="maximized"
    :buttons="computedButtons"
  >
    <component :is="computedComponent" />
  </KModal>
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import { loadComponent } from '../../utils'
import KModal from '../modal/KModal.vue'

// props
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

// emits
defineEmits([...useDialogPluginComponent.emits])

// data
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

// computed
const computedButtons = computed(() => {
  const buttons = []
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
      okButton.handler = () => {
        okButton.handler()
        onDialogOK()
      }
    }
    buttons.push(okButton)
  }
  if (!_.isEmpty(props.cancelAction)) {
    if (typeof props.cancelAction === 'string') {
      buttons.push({
        id: 'ok-action',
        label: props.okAction,
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
  return buttons
})
const computedComponent = computed(() => {
  return loadComponent(props.component)
})
</script>
