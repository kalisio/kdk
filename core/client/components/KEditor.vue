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
import { api, Context, i18n } from '@kalisio/kdk/core.client'
import { Notify } from 'quasar'

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
  },
  notify: {
    type: Object,
    default: () => null
  }
})

// Data
const formRef = ref(null)
const mode = props.object ? 'edition' : 'creation'

// Functions
function getContext () {
  return { props, mode, form: formRef.value }
}
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
      response = await props.beforeRequest(values, getContext())
    }
    if (!response.isOk) return false
    // do the request
    if (mode === 'creation') {
      logger.debug('[KDK] Create object with data', response.values)
      try {
        await service.create(response.values)
        if (_.has(props, 'notify.created.success')) Notify.create({ type: 'positive', message: i18n.t(_.get(props, 'notify.created.success')) })
      } catch (error) {
        if (_.has(props, 'notify.created.error')) Notify.create({ type: 'negative', message: i18n.t(_.get(props, 'notify.created.error')) })
      }
    } else {
      logger.debug(`[KDK] Patch object ${props.object._id} with data`, response.values)
      try {
        await service.patch(props.object._id, response.values)
        if (_.has(props, 'notify.updated.success')) Notify.create({ type: 'positive', message: i18n.t(_.get(props, 'notify.updated.success')) })
      } catch (error) {
        if (_.has(props, 'notify.updated.error')) Notify.create({ type: 'negative', message: i18n.t(_.get(props, 'notify.updated.error')) })
      }
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
  apply,
  getContext
})
</script>
