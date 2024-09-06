<template>
  <KScreen
    :actions="actions"
  >
    <div class="column items-center q-gutter-y-md">
      <KForm
        ref="refForm"
        class="full-width"
        :schema="getFormSchema()"
      />
      <KAction
        id="login-button"
        label="KLoginScreen.LOGIN_LABEL"
        renderer="form-button"
        :loading="loading"
        :handler="onLogin"
      />
    </div>
  </KScreen>
</template>

<script setup>
import _ from 'lodash'
import config from 'config'
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { i18n } from '../../i18n.js'
import { login } from '../../utils/utils.session.js'
import { verifyEmail } from '../../utils/utils.account.js'
import KScreen from './KScreen.vue'
import KForm from '../form/KForm.vue'
import KAction from '../action/KAction.vue'

// Data
const $q = useQuasar()
const refForm = ref()
const actions = ref(_.get(config, 'screens.login.actions', []))
const loading = ref(false)

// Functions
function getFormSchema () {
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'http:/kalisio.xyz/schemas/login.json#',
    title: 'Login form',
    type: 'object',
    properties: {
      email: {
        type: 'string',
        format: 'email',
        field: {
          component: 'form/KEmailField',
          label: 'KLoginScreen.EMAIL_FIELD_LABEL'
        }
      },
      password: {
        type: 'string',
        format: 'password',
        field: {
          component: 'form/KPasswordField',
          label: 'KLoginScreen.PASSWORD_FIELD_LABEL'
        }
      }
    },
    required: ['email', 'password']
  }
}
async function onLogin () {
  const result = refForm.value.validate()
  if (result.isValid) {
    loading.value = true
    if (await verifyEmail(result.values.email)) {
      try {
        await login(result.values.email, result.values.password)
      } catch (error) {
        $q.notify({ type: 'negative', message: i18n.t('KLoginScreen.LOGIN_ERROR') })
      }
    } else {
      $q.notify({ type: 'negative', message: i18n.t('KLoginScreen.INVALID_EMAIL') })
    }
    loading.value = false
  }
}
</script>
