<template>
  <KScreen :title="$t('KSendResetPassword.TITLE')">
    <div slot="screen-content">
      <div class="column justify-center sm-gutter">
        <div :class="textClass" v-if="message">
          <p>
            <q-icon name="las la-exclamation-circle" v-show="send"/>
            &nbsp;&nbsp;
            {{ message }}.
          </p>
        </div>
        <!-- Form -->
        <KForm ref="formRef" :schema="schema" />
        <!-- Actions -->
        <div class="row justify-around">
          <KAction
            id="send-reset-password"
            label="APPLY"
            renderer="form-button"
            :loading="processing"
            :handler="apply"
          />
        </div>
      </div>
    </div>
  </KScreen>
</template>

<script setup>
import _ from 'lodash'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { i18n, utils } from '../..'
import { verifyEmail } from '../../utils/utils.account.js'
import KScreen from '../screen/KScreen.vue'

// Data
const router = useRouter()
const $q = useQuasar()
const formRef = ref(null)
const message = ref(i18n.t('KSendResetPassword.MESSAGE'))
const processing = ref(false)
const send = ref(false)
const schema = ref({
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'http://kalisio.xyz/schemas/send-reset-password#',
  title: 'Send reset password form',
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      field: {
        component: 'form/KEmailField',
        label: 'KSendResetPassword.EMAIL_FIELD_LABEL'
      }
    }
  },
  required: ['email']
})

// Computed
const textClass = computed(() => {
  const classObject = {}
  classObject['self-center'] = true
  if (send.value) classObject['text-negative'] = true
  return classObject
})

// Functions
async function apply () {
  const { isValid, values } = formRef.value.validate()
  if (!isValid) return false
  processing.value = true
  if (await verifyEmail(values.email)) {
    try {
      await utils.sendResetPassword(values.email)
      processing.value = false
      router.push({ path: `reset-password/${values.email}` })
    } catch (error) {
      const type = _.get(error, 'errors.$className')
      switch (type) {
        case 'isVerified':
          message.value = i18n.t('KSendResetPassword.ERROR_MESSAGE_IS_VERIFIED')
          break
        default:
          message.value = i18n.t('KSendResetPassword.ERROR_MESSAGE_DEFAULT')
      }
    }
  } else {
    $q.notify({ type: 'negative', message: i18n.t('KSendResetPassword.ERROR_INVALID_EMAIL') })
  }
  send.value = true
  processing.value = false
}
</script>
