<template>
  <!--
    Form section
  -->
  <KForm
    ref="formRef"
    :schema="schema"
    class="q-pa-sm"
  />
</template>
<script setup>
import { ref, computed } from 'vue'
import { Capture } from '../capture.js'
import moment from 'moment'
import captureSchema from '../../common/schemas/capture.create.json'
import KForm from '../../../core/client/components/form/KForm.vue'

// Data
const formRef = ref(null)

// computed
const schema = computed(() => {
  const dateTimePropertie = captureSchema.properties.dateTime
  dateTimePropertie.default = { start: moment.utc().toISOString(), end: moment.utc().toISOString() }
  dateTimePropertie.field = { ...dateTimePropertie.field, min: moment.utc().subtract(3, 'months').toISOString(), max: moment.utc().toISOString() }
  return captureSchema
})

// Functions
async function apply () {
  const { isValid, values } = formRef.value.validate()
  if (isValid) Capture.process(values)
  return true
}

// Expose
defineExpose({
  apply
})
</script>