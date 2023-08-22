<template>
  <q-card class="q-pa-md">
    <!-- Form -->
    <q-card-section>
      <KForm
        ref="modifyEmailFormRef"
        :schema="modifyEmailSchema"
      />
    </q-card-section>
    <!-- Actions -->
    <q-card-actions align="right">
      <KAction
        id="modify-email"
        label="APPLY"
        renderer="form-button"
        outline
        :loading="processing"
        :handler="apply"
      />
    </q-card-actions>
    <q-dialog v-model="dialog" persistent>
      <q-card>
        <!-- Form -->
        <q-card-section align="center">
          <KForm
            ref="validateEmailFormRef"
            :schema="validateEmailSchema"
          />
        </q-card-section>
        <!-- Actions -->
        <q-card-actions align="center">
          <KAction
            id="validate-email"
            label="APPLY"
            renderer="form-button"
            :loading="processing"
            :handler="applyChanges"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import { Notify } from 'quasar'
import { Store, utils, i18n } from '../..'

// Data
const User = Store.get('user')
const modifyEmailFormRef = ref(null)
const validateEmailFormRef = ref(null)
const dialog = ref(false)
const processing = ref(false)
const modifyEmailSchema = ref({
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'http://kalisio.xyz/schemas/modify-email-manager#',
  title: 'Modify email form',
  type: 'object',
  properties: {
    password: {
      type: 'string',
      format: 'password',
      field: {
        component: 'form/KPasswordField',
        label: 'KEmailManager.PASSWORD_FIELD_LABEL'
      }
    },
    email: {
      type: 'string',
      format: 'email',
      field: {
        component: 'form/KEmailField',
        label: 'KEmailManager.EMAIL_FIELD_LABEL'
      }
    }
  },
  required: ['email', 'password']
})
const validateEmailSchema = ref({
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'http://kalisio.xyz/schemas/verify-email-manager#',
  title: 'Verify email form',
  type: 'object',
  properties: {
    token: {
      type: 'string',
      minLength: 6,
      maxLength: 6,
      tokenLength: 6,
      field: {
        component: 'form/KTokenField',
        label: 'KEmailManager.TOKEN_LABEL'
      }
    }
  },
  required: ['token']
})

// Functions
async function apply () {
  const { isValid, values } = modifyEmailFormRef.value.validate()
  if (!isValid) return false
  try {
    processing.value = true
    await utils.sendChangeIdentity(User.email, values.email, values.password)
    dialog.value = true
    processing.value = false
  } catch (error) {
    processing.value = false
  }
}
async function applyChanges () {
  const { isValid, values } = validateEmailFormRef.value.validate()
  if (!isValid) return
  try {
    processing.value = true
    await utils.verifySignup(values.token, User.email)
    processing.value = false
    Notify.create({ type: 'positive', message: i18n.t('KEmailManager.EMAIL_CHANGED') })
  } catch (error) {
    processing.value = false
    Notify.create({ type: 'negative', message: i18n.t('KEmailManager.ERROR_MESSAGE') })
  }
  dialog.value = false
}
</script>
