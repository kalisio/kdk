<template>
  <KModal
    ref="dialogRef"
    :title="title"
    :toolbar="toolbar"    
    :buttons="computedButtons"
    :width-policy="widthPolicy"
    :maximized="maximized"
  >
    <Suspense>
      <!-- component with v-model -->
      <component
        v-if="model"
        ref="componentRef"
        :is="computedComponent"
        v-model="computedModel"
        v-bind="computedAttrs"
      />
      <!-- component without v-model -->
      <component
        v-else
        ref="componentRef"
        :is="computedComponent"
        v-bind="computedAttrs"
      />
    </Suspense>
  </KModal>
</template>

<script setup>
import _ from 'lodash'
import logger from 'loglevel'
import { ref, computed, useAttrs } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import { loadComponent } from '../utils'
import KModal from './KModal.vue'

// Props
const props = defineProps({
  title: {
    type: String,
    default: undefined
  },
  toolbar: {
    type: Array,
    default: () => null
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
  }
})

// Emits
const emit = defineEmits([...useDialogPluginComponent.emits, 'update:modelValue'])

// Data
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const componentRef = ref()
const attrs = useAttrs()
const model = ref(attrs['v-model'])

// Computed
const computedButtons = computed(() => {
  const buttons = []
  if (!_.isEmpty(props.cancelAction)) {
    if (typeof props.cancelAction === 'string') {
      // create a basic action that close the dialog
      buttons.push({
        id: 'cancel-action',
        label: props.cancelAction,
        outline: true,
        renderer: 'form-button',
        handler: onDialogCancel
      })
    } else {
      // clone the action to overload the handler
      const cancelButton = _.clone(props.cancelAction)
      if (cancelButton.handler) {
        cancelButton.handler = async () => {
          // ! call the original handler to avoid recursive call
          const result = await callHandler(props.cancelAction.handler)
          // close dialog whatever the result of the handler
          onDialogCancel(result)
        }
      }
    }
  }
  if (typeof props.okAction === 'string') {
    buttons.push({
      // create a basic action that close the dialog
      id: 'ok-action',
      label: props.okAction,
      renderer: 'form-button',
      handler: onDialogOK
    })
  } else {
    // clone the action to overload the handler
    const okButton = _.clone(props.okAction)
    if (okButton.handler) {
      // overload the handler to call Quasar onDialogOK
      okButton.handler = async () => {
        // ! call the origonal handler to avoid recursive call
        const result = await callHandler(props.okAction.handler)
        // close dialog if and only if the handler returns true
        if (result) onDialogOK(result)
      }
    }
    buttons.push(okButton)
  }
  return buttons
})
const computedComponent = computed(() => {
  return loadComponent(props.component)
})
const computedModel = computed({
  get: function () {
    return model.value
  },
  set: function (value) {
    model.value = value
    emit('update:modelValue', value)
  }
})
const computedAttrs = computed(() => {
  return _.mapKeys(attrs, (value, key) => {
    return _.replace(key, 'component.', '')
  })
})

// Functions
async function callHandler (handler) {
  let method = handler
  let params
  if (typeof (handler) === 'object') {
    method = handler.name
    if (!method) {
      logger.debug('[KDK] invalid dialog handler')
      return
    }
    params = handler.params
  }
  return await componentRef.value[method](params)
}
</script>
