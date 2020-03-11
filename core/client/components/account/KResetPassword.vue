<template>
  <k-screen :title="$t('KResetPassword.TITLE')">
    <div slot="screen-content">
      <div class="column justify-center sm-gutter">
          <div :class="textClass" v-if="message" >
            <p>
              <q-icon name="check" v-show="reset && success"/>
              <q-icon name="error" v-show="reset && !success"/>
              &nbsp;&nbsp;
              {{ message }}.
            </p>
          </div>
          <div v-if="!success">
            <k-form ref="form" :schema="getSchema()" />
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
  </k-screen>
</template>

<script>
import _ from 'lodash'
import mixins from '../../mixins'

export default {
  name: 'k-reset-password',
  mixins: [
    mixins.account
  ],
  data () {
    return {
      title: '',
      message: '',
      success: false,
      reset: false,
      resetting: false
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
    getSchema () {
      return {
        $schema: 'http://json-schema.org/draft-06/schema#',
        $id: 'http://kalisio.xyz/schemas/reset-password.json#',
        title: 'Reset Password form',
        description: 'Reset password form',
        type: 'object',
        properties: {
          password: {
            type: 'string',
            field: {
              component: 'form/KPasswordField',
              helper: 'KResetPassword.PASSWORD_FIELD_HELPER'
            }
          },
          confirmPassword: {
            const: {
              $data: '1/password'
            },
            field: {
              component: 'form/KPasswordField',
              helper: 'KResetPassword.CONFIRM_PASSWORD_FIELD_HELPER'
            }
          }
        },
        required: ['password']
      }
    },
    async onReset () {
      const result = this.$refs.form.validate()
      if (result.isValid) {
        try {
          this.resetting = true
          await this.resetPassword(this.$route.params.token, result.values.password)
          this.message = this.$t('KResetPassword.SUCCESS_MESSAGE')
          this.success = true
        } catch(error) {
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
    // Load the required components
    this.$options.components['k-screen'] = this.$load('frame/KScreen')
    this.$options.components['k-form'] = this.$load('form/KForm')
    // Components initialization
    this.message = this.$t('KResetPassword.MESSAGE')
  }
}
</script>
