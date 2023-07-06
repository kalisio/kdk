<template>
  <q-card class="q-pa-md">
    <q-card-section>
      <KForm 
        ref="form" 
        :schema="schema" 
      />
    </q-card-section>
    <q-card-actions align="right">
      <KAction
        id="change-password"
        label="APPLY"
        renderer="form-button"
        outline
        :handler="apply"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import KForm from '../form/KForm.vue'
import KAction from '../KAction.vue'

// Data
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

// Functions
function apply () {

}
</script>