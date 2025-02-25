<template>
  <KForm
    ref="formRef"
    :values="object"
    :schema="schema"
    :filter="filter"
  />
</template>

<script setup>
import _ from 'lodash'
import logger from 'loglevel'
import { ref } from 'vue'
import { api, Context } from '@kalisio/kdk/core.client'

// Props
const props = defineProps({
  service: {
    type: String,
    required: true
  },
  baseObject: {
    type: Object,
    default: () => null
  },
  object: {
    type: Object,
    default: () => null
  },
  schema: {
    type: [String, Object],
    default: () => null
  },
  filter: {
    type: [String, Array],
    default: () => null
  },
  beforeRequest: {
    type: Function,
    default: null
  },
  afterRequest: {
    type: Function,
    default: null
  },
  dense: {
    type: Boolean,
    default: false
  }
})

// Data
const formRef = ref(null)
const mode = props.object ? 'edition' : 'creation'

// Functions
async function apply () {
  // validate the form
  const { isValid, values: formValues } = formRef.value.validate()
  if (isValid) {
    // merge values with base object
    const values = _.merge(formValues, props.baseObject)
    // retrieve the service
    const context = Context.get()
    const service = api.getService(props.service, context?.value)
    if (!service) {
      logger.error(`[KDK] Cannot find service ${props.service}`)
      return
    }
    // run the beforeRequest hook
    let response = { isOk: true, values }
    if (props.beforeRequest) {
      logger.debug('[KDK] Apply beforeRequest hook')
      response = await props.beforeRequest(values, { mode, form: formRef.value, ...props })
    }
    if (!response.isOk) return false
    // do the request
    if (mode === 'creation') {
      logger.debug('[KDK] Create object with data', response.values)
      await service.create(values)
    } else {
      logger.debug(`[KDK] Patch object ${props.object._id} with data`, response.values)
      await service.patch(props.object._id, response.values)
    }
    // run the afterRequest hook
    if (props.afterRequest) {
      logger.debug('[KDK] Apply afterRequest hook')
      response = await props.afterRequest(values, { mode, form: formRef.value, ...props })
    }
    if (!response.isOk) return false
    return true
  } else {
    logger.debug('[KDK] Form is invalid')
  }
}

// Expose
defineExpose({
  apply
})
</script>
