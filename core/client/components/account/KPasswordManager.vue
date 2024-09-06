<template>
  <q-card class="q-pa-md">
    <!-- Form -->
    <q-card-section>
      <KForm
        ref="formRef"
        :schema="schema"
      />
    </q-card-section>
    <!-- Actions -->
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
import { Notify } from 'quasar'
import { Store, i18n, utils } from '../..'
import KForm from '../form/KForm.vue'
import KAction from '../action/KAction.vue'

// Data
const formRef = ref(null)
const User = Store.get('user')
const schema = ref({
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'http://kalisio.xyz/schemas/password-manager.json#',
  title: 'Change Password form',
  type: 'object',
  properties: {
    oldPassword: {
      type: 'string',
      format: 'password',
      field: {
        component: 'form/KPasswordField',
        label: 'KPasswordManager.OLD_PASSWORD_FIELD_LABEL'
      }
    },
    password: {
      type: 'string',
      format: 'password',
      field: {
        component: 'form/KPasswordField',
        label: 'KPasswordManager.PASSWORD_FIELD_LABEL'
      }
    },
    confirmPassword: {
      type: 'string',
      format: 'password',
      const: {
        $data: '1/password'
      },
      field: {
        component: 'form/KPasswordField',
        label: 'KPasswordManager.CONFIRM_PASSWORD_FIELD_LABEL'
      }
    }
  },
  required: ['oldPassword', 'password', 'confirmPassword']
})
const processing = ref(false)

// Functions
async function apply () {
  const { isValid, values } = formRef.value.validate()
  if (!isValid) return false
  try {
    processing.value = true
    await utils.changePassword(User.email, values.oldPassword, values.password)
    processing.value = false
    Notify.create({
      type: 'positive',
      message: i18n.t('KPasswordManager.PASSWORD_CHANGED')
    })
  } catch (error) {
    processing.value = false
    return false
  }
  return true
}
</script>
