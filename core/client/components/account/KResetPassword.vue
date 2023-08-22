<template>
  <KScreen :title="$t('KResetPassword.TITLE')" :actions="actions">
    <div slot="screen-content">
      <div class="column justify-center sm-gutter">
        <div :class="textClass" v-if="message">
          <p>
            <q-icon name="las la-exclamation-circle" v-show="send"/>
            &nbsp;&nbsp;
            {{ message }}
          </p>
        </div>
        <!-- Form -->
        <KForm ref="formRef" :schema="schema" />
        <!-- Actions -->
        <div class="row justify-around">
          <KAction
            id="reset-password"
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
import { useRoute } from 'vue-router'
import { Notify } from 'quasar'
import { i18n, utils } from '../..'
import KScreen from '../screen/KScreen.vue'

// Data
const route = useRoute()
const formRef = ref(null)
const message = ref(i18n.t('KResetPassword.MESSAGE'))
const processing = ref(false)
const send = ref(false)
const schema = ref({
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'http://kalisio.xyz/schemas/reset-password.json#',
  title: 'Reset Password form',
  description: 'Reset password form',
  type: 'object',
  properties: {
    password: {
      type: 'string',
      format: 'password',
      field: {
        component: 'form/KPasswordField',
        label: 'KResetPassword.PASSWORD_FIELD_LABEL'
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
        label: 'KResetPassword.CONFIRM_PASSWORD_FIELD_LABEL'
      }
    },
    token: {
      type: 'string',
      minLength: 6,
      maxLength: 6,
      tokenLength: 6,
      field: {
        component: 'form/KTokenField',
        label: 'KResetPassword.TOKEN_FIELD_LABEL'
      }
    }
  },
  required: ['password', 'confirmPassword', 'token']
})

// Computed
const textClass = computed(() => {
  const classObject = {}
  classObject['self-center'] = true
  if (send.value) classObject['text-negative'] = true
  return classObject
})
const actions = computed(() => {
  return [{ id: 'reset-password-link', label: 'KResetPassword.RESEND_LINK', route: { name: 'send-reset-password' } }]
})

// Functions
async function apply () {
  const { isValid, values } = formRef.value.validate()
  if (!isValid) return false
  try {
    processing.value = true
    await utils.resetPassword(route.params.email, values.token, values.password)
    Notify.create({ type: 'positive', message: i18n.t('KResetPassword.SUCCESS_MESSAGE') })
    await utils.login(route.params.email, values.password)
    processing.value = false
  } catch (error) {
    processing.value = false
    const type = _.get(error, 'errors.$className')
    switch (type) {
      case 'badParams':
        message.value = i18n.t('KResetPassword.ERROR_MESSAGE_BAD_PARAMS')
        break
      case 'resetExpired':
        message.value = i18n.t('KResetPassword.ERROR_MESSAGE_VERIFY_EXPIRED')
        break
      default:
        message.value = i18n.t('KResetPassword.ERROR_MESSAGE_DEFAULT')
    }
  }
  send.value = true
}
</script>
