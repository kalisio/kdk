<template>
  <KForm
    id="settings"
    ref="formRef"
    :values="settings"
    schema="settings.update"
    :filter="schemaFilter"
  />
</template>

<script setup>
import _ from 'lodash'
import { ref, onMounted } from 'vue'
import { api } from '../../api.js'
import KForm from '../form/KForm.vue'

// Data
const serviceSettings = api.getService('settings')
const formRef = ref(null)
const settings = ref(null)
const schemaFilter = ref(null)

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
  const mapping = serviceSettings.getSettingsMapping()
  schemaFilter.value = Object.keys(mapping).filter(value => _.get(mapping, value))
})

// Expose
defineExpose({
  apply
})
</script>
