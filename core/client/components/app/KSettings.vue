<template>
  <KForm
    id="settings"
    ref="formRef"
    :values="settings"
    :schema="schema"
    :filter="schemaFilter"
  />
</template>

<script setup>
import _ from 'lodash'
import { ref, onMounted } from 'vue'
import { api } from '../../api.js'
import KForm from '../form/KForm.vue'

// Props
const props = defineProps({
  filter: {
    type: Object,
    default: () => null
  }
})

// Data
const serviceSettings = api.getService('settings')
const formRef = ref(null)
const settings = ref(null)
const schemaFilter = ref(null)
const schema = ref('settings.update')

// Functions
async function apply () {
  const { isValid, values } = formRef.value.validate()
  if (isValid) {
    await serviceSettings.patch('settings', values)
    return true
  }
}

// Hooks
onMounted(async () => {
  settings.value = await serviceSettings.get('settings')
  if (props.filter) schemaFilter.value = Object.keys(props.filter).filter(value => _.get(props.filter, value))
  else {
    const mapping = serviceSettings.getSettingsMapping()
    schemaFilter.value = Object.keys(mapping).filter(value => _.get(mapping, value))
    if (_.isEmpty(schemaFilter.value)) schemaFilter.value = null
  }
})

// Immediate
schema.value = serviceSettings.getSchema()

// Expose
defineExpose({
  apply
})
</script>
