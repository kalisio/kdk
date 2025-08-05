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
import captureSchema from '../../../extras/schemas/capture.create.json'
import KForm from '../../../core/client/components/form/KForm.vue'

// Data
const formRef = ref(null)

// computed
const schema = computed(() => {
  const dateTimePropertie = captureSchema.properties.dateTime
  dateTimePropertie.default = {
    start: moment.utc().toISOString(),
    end: moment.utc().toISOString()
  }
  // TODO: could be dynamically computed from layers
  // For archived data we have typically 10 years in layers
  // For forecast data we have at most couple of weeks
  dateTimePropertie.field = {
    ...dateTimePropertie.field,
    min: moment.utc().subtract(10, 'years').toISOString(),
    max: moment.utc().add(1, 'months').toISOString()
  }
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
