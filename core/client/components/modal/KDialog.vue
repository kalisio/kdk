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
    type: String,
    default: 'OK'
  },
  cancelAction: {
    type: String,
    default: undefined
  },
  maximized: {
    type: Boolean,
    default: false
  }
})

// emits
const emit = defineEmits([...useDialogPluginComponent.emits])

// data
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

// computed
const computedButtons = computed (() => {
  let buttons = [{
    id: 'ok-action',
    label: props.okAction,
    renderer: 'form-button',
    handler: onDialogOK
  }]
  if (! _.isEmpty(props.cancelAction)) buttons.push({
    id: 'ok-action',
    label: props.okAction,
    renderer: 'form-button',
    handler: onDialogCancel
  })
  return buttons
})
const computedComponent = computed(() => {
  return loadComponent(props.component)
})
</script>
