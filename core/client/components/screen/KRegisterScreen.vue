<template>
  <KScreen message="KRegisterScreen.MESSAGE" :actions="actions">
    <div class="column items-center q-gutter-y-md">
      <KForm
        ref="refForm"
        class="full-width"
        :schema="getFormSchema()"
      />
      <KAction
        id="register-button"
        label="KRegisterScreen.REGISTER_LABEL"
        renderer="form-button"
        :loading="loading"
        :handler="onRegister"
      />
    </div>
  </KScreen>
</template>

<script setup>
import { getLocale } from '../../utils/utils.locale.js'
import { register } from '../../utils/utils.session.js'
import _ from 'lodash'
import config from 'config'
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { i18n } from '../../i18n.js'
import KScreen from './KScreen.vue'
import KForm from '../form/KForm.vue'
import KAction from '../action/KAction.vue'

// Data
const $q = useQuasar()
const refForm = ref()
const actions = ref(_.get(config, 'screens.register.actions', []))
const loading = ref(false)
const domain = _.get(config, 'domain')

// Function
function getFormSchema () {
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'http://kalisio.xyz/schemas/register.json#',
    title: 'Registration Form',
    type: 'object',
    properties: {
      name: {
        type: 'string',
        minLength: 3,
        maxLength: 128,
        field: {
          component: 'form/KTextField',
          label: 'KRegisterScreen.NAME_FIELD_LABEL'
        }
      },
      email: {
        type: 'string',
        format: 'email',
        field: {
          component: 'form/KEmailField',
          label: 'KRegisterScreen.EMAIL_FIELD_LABEL'
        }
      },
      password: {
        type: 'string',
        format: 'password',
        field: {
          component: 'form/KPasswordField',
          label: 'KRegisterScreen.PASSWORD_FIELD_LABEL'
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
          label: 'KRegisterScreen.CONFIRM_PASSWORD_FIELD_LABEL'
        }
      },
      consentTerms: {
        type: 'boolean',
        default: false,
        enum: [true],
        field: {
          component: 'form/KToggleField',
          label: i18n.t('KRegisterScreen.ACCEPT_TERMS_LABEL'),
          errorLabel: i18n.t('KRegisterScreen.ACCEPT_TERMS_ERROR_LABEL', { domain }),
          'checked-icon': 'check',
          'unchecked-icon': 'clear'
        }
      }
    },
    required: ['name', 'email', 'password', 'confirmPassword', 'consentTerms']
  }
}
async function onRegister (event) {
  const result = refForm.value.validate()
  if (result.isValid) {
    loading.value = true
    // Add the locale information
    result.values.locale = getLocale()
    try {
      await register(result.values)
    } catch (error) {
      $q.notify({ type: 'negative', message: i18n.t('KRegisterScreen.REGISTER_ERROR') })
    }
    loading.value = false
  }
}
</script>
