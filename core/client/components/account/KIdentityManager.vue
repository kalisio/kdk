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
function apply () {

}
</script>