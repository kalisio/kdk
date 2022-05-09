<template>
  <k-screen :title="canLogWithExternalProviders ? $t('KLogin.TITLE') : ''" :links="links">
    <div slot="screen-content">
      <div class="column justify-center">
        <!--
          Login providers
        -->
        <div v-if="canLogWithExternalProviders" class="row justify-around">
          <template v-for="provider in providers" :key="getProviderName(provider)">
            <q-btn :icon="getProviderIcon(provider)"
              :id="getProviderName(provider)"
              @click="onLogWith(provider)"
              :label="getProviderLabel(provider)">
            </q-btn>
          </template>
        </div>
        <div v-if="canLogWithExternalProviders && canLogWithLocalProvider" class="row items-center">
          <div class="col-1 text-subtitle1">{{ $t('KLogin.OR_LABEL') }}</div>
          <div class="col-11"><hr></div>
        </div>
        <!--
          Login form
        -->
        <div v-if="canLogWithLocalProvider">
          <k-form ref="form" :schema="schema" @form-ready="onFormReady"/>
        </div>
        <div v-if="canLogWithLocalProvider" class="q-pa-sm self-center">
          <q-btn :loading="loading" color="primary" id="local" :label="$t('KLogin.APPLY_BUTTON')" @click="onLogin"/>
        </div>
      </div>
    </div>
  </k-screen>
</template>

<script>
import { QBtn, Platform } from 'quasar'
import { KScreen } from '../frame'
import { KForm } from '../form'
import { authentication, version } from '../../mixins'

export default {
  name: 'k-login',
  components: {
    QBtn,
    KForm,
    KScreen
  },
  mixins: [ 
    authentication, 
    version
  ],
  data () {
    return {
      schema: {
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
              label: 'KLogin.EMAIL_FIELD_LABEL'
            }
          },
          password: {
            type: 'string',
            field: {
              component: 'form/KPasswordField',
              label: 'KLogin.PASSWORD_FIELD_LABEL'
            }
          }
        },
        required: ['email', 'password']
      },
      providers: [],
      links: [],
      displayDetails: false,
      loading: false
    }
  },
  computed: {
    canLogWithExternalProviders () {
      if (this.providers.length === 0) return false
      else return this.$config('flavor') === 'dev' ? true : !Platform.is.cordova
    },
    canLogWithLocalProvider () {
      return this.$config('screens.login.localProvider', true)
    }
  },
  methods: {
    getProviderIcon (provider) {
      if (typeof provider === 'object') return provider.icon
      else return 'fab fa-' + provider
    },
    getProviderLabel (provider) {
      if (typeof provider === 'object') return this.$t(provider.label)
      else return provider
    },
    getProviderName (provider) {
      if (typeof provider === 'object') return provider.name
      else return provider
    },
    storeCredentials () {
      return Platform.is.cordova
    },
    hasCredentials () {
      return window.localStorage.getItem('klogin.email')
    },
    onFormReady (form) {
      if (this.storeCredentials() && this.hasCredentials()) {
        form.fill({
          email: window.localStorage.getItem('klogin.email')
        })
      }
    },
    async onLogin (event) {
      const result = this.$refs.form.validate()
      if (result.isValid) {
        this.loading = true
        try {
          await this.login(result.values.email, result.values.password)
          if (this.storeCredentials()) {
            window.localStorage.setItem('klogin.email', result.values.email)
          }
        } catch (_) {
          this.$toast({ message: this.$t('KLogin.LOGIN_ERROR') })
        }
        this.loading = false
      }
    },
    onLogWith (provider) {
      const authUrl = this.$api.getBaseUrl() + '/auth/' + this.getProviderName(provider).toLowerCase()
      const callbackUrl = authUrl + '/callback'
      if (Platform.is.cordova) {
        // Use in app browser so that we can intercept the redirect on the callback URL
        const authBrowser = window.cordova.InAppBrowser.open(authUrl, '_blank', 'location=no,clearsessioncache=yes,clearcache=yes')
        // Detect when the login has finished and the feathers cookie is ready
        authBrowser.addEventListener('loadstop', event => {
          // Detect the callback URL from backend, take care it is also used in the OAuth2 login screen as query parameter
          if (event.url.includes('/callback') && !event.url.includes('redirect_uri')) {
            const callbackBrowser = window.cordova.InAppBrowser.open(callbackUrl, '_blank', 'location=no,clearsessioncache=yes,clearcache=yes')
            callbackBrowser.addEventListener('loadstop', event => {
              // Detect when the login has finished and the feathers cookie is ready
              if (event.url.includes(this.$api.getBaseUrl())) {
                // FIXME: customize cookie name
                callbackBrowser.executeScript(
                  // Code to extract JWT from cookie
                  { code: 'document.cookie.valueOf("feathers-jwt")' }, token => {
                    window.localStorage.setItem('feathers-jwt', token)
                    callbackBrowser.close()
                    authBrowser.close()
                    // Restore session
                    this.$router.push({ name: 'home' })
                  }
                )
              }
            })
          }
        })
      } else {
        location.href = authUrl
      }
    }
  },
  created () {
    // Configure this screen
    this.providers = this.$config('screens.login.providers', [])
    this.links = this.$config('screens.login.links', [])
  }
}
</script>
