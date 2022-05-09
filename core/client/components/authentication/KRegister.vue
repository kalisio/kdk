<template>
  <k-screen :title="$t('KRegister.TITLE')" :links="links">
    <div slot="screen-content">
      <div class="column justify-center q-gutter-sm">
        <div>
          <k-form ref="form" :schema="getSchema()" />
        </div>
        <div class="q-pa-sm self-center">
          <q-btn :loading="loading" color="primary" id="register" :label="$t('KRegister.APPLY_BUTTON')" @click="onRegister"/>
        </div>
      </div>
    </div>
  </k-screen>
</template>

<script>
import { KScreen } from '../frame'
import { KForm } from '../form'
import { authentication } from '../../mixins'
import { getLocale } from '../../utils'

export default {
  name: 'k-register',
  components: {
    KForm,
    KScreen
  },
  mixins: [ authentication ],
  data () {
    return {
      links: [],
      loading: false
    }
  },
  methods: {
    getSchema () {
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
              label: 'KRegister.NAME_FIELD_LABEL'
            }
          },
          email: {
            type: 'string',
            format: 'email',
            field: {
              component: 'form/KEmailField',
              label: 'KRegister.EMAIL_FIELD_LABEL'
            }
          },
          password: {
            type: 'string',
            field: {
              component: 'form/KPasswordField',
              label: 'KRegister.PASSWORD_FIELD_LABEL'
            }
          },
          confirmPassword: {
            const: {
              $data: '1/password'
            },
            field: {
              component: 'form/KPasswordField',
              label: 'KRegister.CONFIRM_PASSWORD_FIELD_LABEL'
            }
          },
          consentTerms: {
            type: 'boolean',
            default: false,
            enum: [true],
            field: {
              component: 'form/KToggleField',
              label: this.$t('KRegister.ACCEPT_TERMS_LABEL'),
              helper: this.$t('KRegister.ACCEPT_TERMS_HELPER', { domain: this.$config('domain') }),
              errorLabel: this.$t('KRegister.ACCEPT_TERMS_ERROR_LABEL', { domain: this.$config('domain') }),
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
        } catch (_) {
          this.$toast({ message: this.$t('KRegister.REGISTER_ERROR') })
        }
        this.loading = false
      }
    }
  },
  created () {
    // Configure this screen
    this.links = this.$config('screens.register.links', [])
  }
}
</script>
