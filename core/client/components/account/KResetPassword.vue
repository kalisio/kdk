<template>
  <KScreen :title="$t('KResetPassword.TITLE')">
    <div slot="screen-content">
      <div class="column justify-center sm-gutter">
          <div :class="textClass" v-if="message" >
            <p>
              <q-icon name="las la-check" v-show="reset && success"/>
              <q-icon name="las la-exclamation-circle" v-show="reset && !success"/>
              &nbsp;&nbsp;
              {{ message }}.
            </p>
          </div>
          <div v-if="!success">
            <k-form ref="form" :schema="schema" />
          </div>
          <div v-if="!success">
            <div class="row justify-around">
              <q-btn color="primary" :loading="resetting" @click="onReset">
                {{$t('KResetPassword.ACTION')}}
              </q-btn>
            </div>
          </div>
          <div class="self-center">
            <a v-if="reset && !success" @click="$router.push({name: 'send-reset-password'})">
              {{$t('KResetPassword.RESEND_LINK')}}
            </a>
            &nbsp;&nbsp;
            <a v-if="reset && success" @click="$router.push({name: 'login'})">
              {{$t('KResetPassword.LOG_IN_LINK')}}
            </a>
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
      success: false,
      reset: false,
      resetting: false,
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
          }
        },
        required: ['password', 'confirmPassword']
      }
    }
  },
  computed: {
    textClass () {
      const classObject = {}
      if (this.reset) {
        classObject['text-positive'] = this.success
        classObject['text-negative'] = !this.success
      }
      return classObject
    }
  },
  methods: {
    async onReset () {
      const result = this.$refs.form.validate()
      if (result.isValid) {
        try {
          this.resetting = true
          await this.resetPassword(this.$route.params.token, result.values.password)
          this.message = this.$t('KResetPassword.SUCCESS_MESSAGE')
          this.success = true
        } catch (error) {
          const type = _.get(error, 'errors.$className')
          switch (type) {
            case 'badParams':
              this.message = this.$t('KResetPassword.ERROR_MESSAGE_BAD_PARAMS')
              break
            case 'verifyExpired':
              this.message = this.$t('KResetPassword.ERROR_MESSAGE_VERIFY_EXPIRED')
              break
            default:
              this.message = this.$t('KResetPassword.ERROR_MESSAGE_DEFAULT')
          }
          this.success = false
        }
        this.reset = true
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
