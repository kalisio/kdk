<template>
  <KScreen
    :actions="actions"
  >
    <div class="column items-center q-gutter-y-md">
      <KForm
        ref="refForm"
        class="full-width"
        :schema="getFormSchema()"
        @form-ready="onFormReady"
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
import KScreen from './KScreen.vue'
import KForm from '../form/KForm.vue'
import KAction from '../KAction.vue'
import { login } from '../../utils/utils.session.js'

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
function canStoreCredentials () {
  return $q.platform.is.cordova
}
function hasCredentials () {
  return window.localStorage.getItem('klogin.email')
}
async function onLogin () {
  const result = refForm.value.validate()
  if (result.isValid) {
    loading.value = true
    try {
      await login(result.values.email, result.values.password)
      if (canStoreCredentials()) {
        window.localStorage.setItem('klogin.email', result.values.email)
      }
    } catch (error) {
      $q.notify({ type: 'negative', message: i18n.t('KLoginScreen.LOGIN_ERROR') })
    }
    loading.value = false
  }
}
function onFormReady (form) {
  if (canStoreCredentials() && hasCredentials()) {
    form.fill({
      email: window.localStorage.getItem('klogin.email')
    })
  }
}
</script>
