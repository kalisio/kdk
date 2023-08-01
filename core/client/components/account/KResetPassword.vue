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
        <div>
          <k-form ref="form" :schema="schema" />
        </div>
        <div>
          <div class="row justify-around">
            <q-btn color="primary" :loading="resetting" @click="onReset">
              {{$t('KResetPassword.ACTION')}}
            </q-btn>
          </div>
        </div>
      </div>
    </div>
  </KScreen>
</template>

<script>
import _ from 'lodash'
import KScreen from '../screen/KScreen.vue'
import KForm from '../form/KForm.vue'
import { account } from '../../mixins'
import { login } from '../../utils/utils.session.js'

export default {
  name: 'k-reset-password',
  components: {
    KScreen,
    KForm
  },
  mixins: [account],
  data () {
    return {
      title: '',
      message: '',
      resetting: false,
      send: false,
      schema: {
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
              label: 'KResetPassword.TOKEN_FIELD_LABEL',
            }
          }
        },
        required: ['password', 'confirmPassword', 'token']
      }
    }
  },
  computed: {
    textClass () {
      const classObject = {}
      classObject['self-center'] = true
      if (this.send) classObject['text-negative'] = true
      return classObject
    },
    actions () {
      return [{ id: 'reset-password-link', label: 'KResetPassword.RESEND_LINK', route: { name: 'send-reset-password' } }]
    }
  },
  methods: {
    async onReset () {
      const result = this.$refs.form.validate()
      if (result.isValid) {
        try {
          this.resetting = true
          await this.resetPassword(this.$route.params.email, result.values.token, result.values.password)
          await login(this.$route.params.email, result.values.password)
          this.$notify({ type: 'positive', message: this.$t('KResetPassword.SUCCESS_MESSAGE') })
        } catch (error) {
          const type = _.get(error, 'errors.$className')
          switch (type) {
            case 'badParams':
              this.message = this.$t('KResetPassword.ERROR_MESSAGE_BAD_PARAMS')
              break
            case 'resetExpired':
              this.message = this.$t('KResetPassword.ERROR_MESSAGE_VERIFY_EXPIRED')
              break
            default:
              this.message = this.$t('KResetPassword.ERROR_MESSAGE_DEFAULT')
          }
        }
        this.send = true
        this.resetting = false
      }
    }
  },
  created () {
    // Components initialization
    this.message = this.$t('KResetPassword.MESSAGE')
  }
}
</script>
