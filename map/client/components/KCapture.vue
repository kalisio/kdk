<template>
  <!--
    Form section
  -->
  <KForm
    ref="formRef"
    :schema="captureSchema"
    class="q-pa-sm"
  />
</template>
<script setup>
import { ref } from 'vue'
import { CaptureProcessing } from '../capture.js'
import captureSchema from '../../common/schemas/capture.create.json'
import KForm from '../../../core/client/components/form/KForm.vue'

// Data
const formRef = ref(null)

// Functions
async function apply () {
  const { isValid, values } = formRef.value.validate()
  CaptureProcessing.capture(isValid, values)
  return true
}

// Expose
defineExpose({
  apply
})
</script>