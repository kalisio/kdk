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
        v-if="useModel"
        ref="componentRef"
        :is="computedComponent"
        v-model="computedModel"
        v-bind="computedAttrs"
        v-on="computedHandlers"
      />
      <!-- component without v-model -->
      <component
        v-else
        ref="componentRef"
        :is="computedComponent"
        v-bind="computedAttrs"
        v-on="computedHandlers"
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
  handlers: {
    type: Object,
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
const useModel = _.has(attrs, 'v-model')
const model = ref(attrs['v-model'])
const loading = ref(false)

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
        disabled: loading.value,
        handler: onDialogCancel
      })
    } else {
      // clone the action to overload the handler
      const cancelButton = _.merge({ disabled: loading.value }, props.cancelAction)
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
      loading: loading.value,
      handler: onDialogOK
    })
  } else {
    // clone the action to overload the handler
    const okButton = _.merge({ loading: loading.value }, props.okAction)
    if (okButton.handler) {
      // overload the handler to call Quasar onDialogOK
      okButton.handler = async () => {
        // ! call the orignal handler to avoid recursive call
        loading.value = true
        const result = await callHandler(props.okAction.handler)
        loading.value = false
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
const computedHandlers = computed(() => {
  if (_.isEmpty(props.handlers)) return {}
  return props.handlers
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
