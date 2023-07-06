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
import { Notify } from 'quasar'
import KForm from '../form/KForm.vue'
import KAction from '../KAction.vue'
import { Store, utils } from '../..'

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
        label: 'KChangePassword.OLD_PASSWORD_FIELD_LABEL'
      }
    },
    password: {
      type: 'string',
      format: 'password',
      field: {
        component: 'form/KPasswordField',
        label: 'KChangePassword.PASSWORD_FIELD_LABEL'
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
        label: 'KChangePassword.CONFIRM_PASSWORD_FIELD_LABEL'
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
    await utils.changePassword(Store.get('user.email'), values.oldPassword, values.password)
    processing.value = false
    Notify.create({
      type: 'positive',
      message: i18n.t('KPasswordManager.PASSWORD_CHANGED'),
    })
  } catch (error) {
    processing.value = false
    /*const type = _.get(error, 'errors.$className')
    switch (type) {
      case 'badParams':
        this.message = this.$t('KChangePassword.ERROR_MESSAGE_BAD_PARAMS')
        break
      default:
        this.message = this.$t('KChangePassword.ERROR_MESSAGE_DEFAULT')
    }*/
    return false
  }
  return true
}
</script>