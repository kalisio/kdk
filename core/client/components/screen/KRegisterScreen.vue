<template>
  <KScreen message="KRegisterScreen.MESSAGE" :actions="actions">
    <div class="column items-center q-gutter-y-md">
      <k-form
        ref="form"
        class="full-width"
        :schema="getFormSchema()"
      />
      <k-action
        id="register-button"
        label="KRegisterScreen.REGISTER_LABEL"
        renderer="form-button"
        :loading="loading"
        :handler="this.onRegister"
      />
    </div>
  </KScreen>
</template>

<script>
import { getLocale } from '../../utils.js'
import KScreen from './KScreen.vue'
import KForm from '../form/KForm.vue'
import KAction from '../frame/KAction.vue'
import { authentication } from '../../mixins'

export default {
  components: {
    KScreen,
    KForm,
    KAction
  },
  mixins: [authentication],
  data () {
    return {
      actions: [],
      loading: false
    }
  },
  methods: {
    getFormSchema () {
      return {
        $schema: 'http://json-schema.org/draft-06/schema#',
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
            field: {
              component: 'form/KPasswordField',
              label: 'KRegisterScreen.PASSWORD_FIELD_LABEL'
            }
          },
          confirmPassword: {
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
              label: this.$t('KRegisterScreen.ACCEPT_TERMS_LABEL'),
              helper: this.$t('KRegisterScreen.ACCEPT_TERMS_HELPER', { domain: this.$config('domain') }),
              errorLabel: this.$t('KRegisterScreen.ACCEPT_TERMS_ERROR_LABEL', { domain: this.$config('domain') }),
              'checked-icon': 'check',
              'unchecked-icon': 'clear'
            }
          }
        },
        required: ['name', 'email', 'password', 'confirmPassword', 'consentTerms']
      }
    },
    async onRegister (event) {
      const result = this.$refs.form.validate()
      if (result.isValid) {
        this.loading = true
        // Add the locale information
        result.values.locale = getLocale()
        try {
          await this.register(result.values)
        } catch (error) {
          this.$toast({ message: this.$t('KRegisterScreen.REGISTER_ERROR') })
        }
        this.loading = false
      }
    }
  },
  created () {
    // Configure this screen
    this.actions = this.$config('screens.register.actions', [])
  }
}
</script>
