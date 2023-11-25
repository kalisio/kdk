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
import { capture } from '../utils/utils.capture'
import { Notify } from 'quasar'
import { i18n } from '../../../core/client/index.js'
import captureSchema from '../../common/schemas/capture.create.json'
import KForm from '../../../core/client/components/form/KForm.vue'

// Data
let processing = false
const formRef = ref(null)

// Functions
async function apply () {
  const { isValid, values } = formRef.value.validate()
  // Check if processing is already in progress
  if (processing) {
    return Notify.create({ type: 'negative', message: i18n.t('KCapture.ERROR_MESSAGE') })
  }
  if (isValid) {
    processing = true
    await capture(values)
    processing = false
    return true
  }
}

// Expose
defineExpose({
  apply
})
</script>
