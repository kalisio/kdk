<template>
  <KScreen :actions="actions">
    <div class="column items-center q-gutter-y-md">
      <KForm
        ref="form"
        class="full-width"
        :schema="getFormSchema()"
        @form-ready="onFormReady"
      />
      <KAction
        id="login-button"
        label="KLoginScreen.LOGIN_LABEL"
        renderer="form-button"
        :loading="loading"
        :handler="this.onLogin"
      />
    </div>
  </KScreen>
</template>

<script>
import { Platform } from 'quasar'
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
            field: {
              component: 'form/KPasswordField',
              label: 'KLoginScreen.PASSWORD_FIELD_LABEL'
            }
          }
        },
        required: ['email', 'password']
      }
    },
    canStoreCredentials () {
      return Platform.is.cordova
    },
    hasCredentials () {
      return window.localStorage.getItem('klogin.email')
    },
    async onLogin () {
      const result = this.$refs.form.validate()
      if (result.isValid) {
        this.loading = true
        try {
          await this.login(result.values.email, result.values.password)
          if (this.canStoreCredentials()) {
            window.localStorage.setItem('klogin.email', result.values.email)
          }
        } catch (error) {
          this.$notify({ message: this.$t('KLoginScreen.LOGIN_ERROR') })
        }
        this.loading = false
      }
    },
    onFormReady (form) {
      if (this.canStoreCredentials() && this.hasCredentials()) {
        form.fill({
          email: window.localStorage.getItem('klogin.email')
        })
      }
    }
  },
  created () {
    // Configure this screen
    this.actions = this.$config('screens.login.actions', this.actions)
  }
}
</script>
