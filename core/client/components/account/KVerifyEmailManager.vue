<template>
  <!-- Helper -->
  <q-expansion-item icon="las la-question" :label="$t('KVerifyEmailManager.HELP_LABEL')">
    <div class="q-pa-md">
      <i18n-t class="text-body2" keypath="KVerifyEmailManager.HELP_TEXT" tag="p" scope="global" />
    </div>
  </q-expansion-item>
  <q-expansion-item icon="las la-question" :label="$t('KVerifyEmailManager.HELP_EMAIL_LABEL')">
    <div class="q-pa-md">
      <i18n-t class="text-body2" keypath="KVerifyEmailManager.HELP_EMAIL_TEXT" tag="p" scope="global">
        <template v-slot:email>
          <span class="text-weight-bold">{{ notifierEmail }}</span>
        </template>
      </i18n-t>
    </div>
  </q-expansion-item>
  <q-card>
    <!-- Form -->
    <q-card-section>
      <KForm
        ref="formRef"
        :schema="schema"
      />
    </q-card-section>
    <!-- Actions -->
    <q-card-actions align="center">
      <KAction
        id="verify-email"
        label="APPLY"
        renderer="form-button"
        :loading="processing"
        :handler="apply"
      />
      <KAction
        id="resend-verify-signup"
        label="KVerifyEmailManager.ACTION"
        renderer="form-button"
        outline
        :handler="resendVerifySignup"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref } from 'vue'
import { Notify } from 'quasar'
import { Store, i18n, utils } from '../..'

// Props
defineProps({
  notifierEmail: {
    type: String,
    default: true
  }
})

// Data
const User = Store.get('user')
const formRef = ref(null)
const processing = ref(false)
const schema = ref({
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
        label: 'KVerifyEmailManager.TOKEN_LABEL',
      }
    }
  },
  required: ['token']
})

// Functions
async function apply () {
  const { isValid, values } = formRef.value.validate()
  if (!isValid) return
  try {
    processing.value = true
    await utils.verifySignup(values.token, User.email)
    processing.value = false
    Notify.create({
      type: 'positive',
      message: i18n.t('KVerifyEmailManager.EMAIL_VERIFIED')
    })
  } catch (error) {
    processing.value = false
    Notify.create({
      type: 'negative',
      message: i18n.t('KVerifyEmailManager.ERROR_MESSAGE')
    })
  }
}
function resendVerifySignup () {
  utils.resendVerifySignup(User.email)
}
</script>