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
        id="change-password"
        label="APPLY"
        renderer="form-button"
        outline
        :loading="processing"
        :handler="apply"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import { Store, i18n, utils } from '../..'
import { Notify } from 'quasar'
import KForm from '../form/KForm.vue'
import KAction from '../KAction.vue'

// Data
const formRef = ref(null)
const User = Store.get('user')
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
const processing = ref(false)

// Functions
async function apply () {
  const { isValid, values } = formRef.value.validate()
  if (!isValid) return false
  try {
    processing.value = true
    await utils.sendChangeIdentity(User.email, values.email, values.password)
    processing.value = false
    Notify.create({
      type: 'positive',
      message: i18n.t('KIdentityManager.IDENTITY_CHANGED')
    })
  } catch (error) {
    processing.value = false
    return false
  }
  return true
}
</script>
