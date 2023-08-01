<template>
  <q-card class="q-pa-md">
    <q-card-section>
      <KForm
        ref="formRef"
        :schema="schema"
      />
    </q-card-section>
    <q-card-actions align="right">
      <KAction
        id="change-identity"
        label="APPLY"
        renderer="form-button"
        outline
        :loading="processing"
        :handler="applyChanges"
      />
    </q-card-actions>
  </q-card>
  <q-dialog v-model="dialog">
    <KVerifyEmail @close-popup="closePopup"/>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { Store, utils } from '../..'
import KForm from '../form/KForm.vue'
import KAction from '../KAction.vue'
import KVerifyEmail from './KVerifyEmail.vue'

// Data
const User = Store.get('user')
const formRef = ref(null)
const dialog = ref(false)
const processing = ref(false)
const schema = ref({
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'http://kalisio.xyz/schemas/identity-manager#',
  title: 'Send change identity form',
  type: 'object',
  properties: {
    password: {
      type: 'string',
      format: 'password',
      field: {
        component: 'form/KPasswordField',
        label: 'KSendChangeIdentity.PASSWORD_FIELD_LABEL'
      }
    },
    email: {
      type: 'string',
      format: 'email',
      field: {
        component: 'form/KEmailField',
        label: 'KSendChangeIdentity.EMAIL_FIELD_LABEL'
      }
    }
  },
  required: ['email', 'password']
})

// Functions
async function applyChanges () {
  const { isValid, values } = formRef.value.validate()
  if (!isValid) return false
  try {
    processing.value = true
    await utils.sendChangeIdentity(User.email, values.email, values.password)
    dialog.value = true
    processing.value = false
  } catch (error) {
    processing.value = false
    return false
  }
  return true
}
function closePopup () {
  dialog.value = false
}
</script>
