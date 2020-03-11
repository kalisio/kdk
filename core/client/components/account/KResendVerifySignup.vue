<template>
  <k-screen :title="$t('KResendVerifySignup.TITLE')">
    <div slot="screen-content">
      <div class="column justify-center sm-gutter">
          <div :class="textClass">
            <p>
              <q-icon name="check" v-show="sent && success"/>
              <q-icon name="error" v-show="sent && !success"/>
              &nbsp;&nbsp;
              {{message}}.
            </p>
          </div>
          <div>
            <k-form ref="form" :schema="schema" />
          </div>
          <div>
            <div class="row justify-around">
              <q-btn color="primary" :loading="sending" @click="onSend">
                {{$t('KResendVerifySignup.ACTION')}}
              </q-btn>
            </div>
          </div>
      </div>
    </div>
  </k-screen>
</template>

<script>
import _ from 'lodash'
import mixins from '../../mixins'

export default {
  name: 'k-resend-verification-email',
  mixins: [
    mixins.account
  ],  
  data () {
    return {
      title: '',
      message: '',
      success: false,
      sent: false,
      sending: false,
      schema: {
        $schema: 'http://json-schema.org/draft-06/schema#',
        $id: 'http://kalisio.xyz/schemas/resend-verification-email#',
        title: 'Resend verification email form',
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            field: {
              component: 'form/KEmailField',
              helper: 'KResendVerifySignup.EMAIL_FIELD_HELPER'
            }
          }
        },
        required: ['email']
      }
    }
  },
  computed: {
    textClass () {
      const classObject = {}
      if (this.sent) {
        classObject['text-positive'] = this.success
        classObject['text-negative'] = !this.success
      }
      return classObject
    }
  },
  methods: {
    async onSend () {
      const result = this.$refs.form.validate()
      if (result.isValid) {
        try {
          this.sending = true
          await this.resendVerifySignup(result.values.email)
          this.message = this.$t('KResendVerifySignup.SUCCESS_MESSAGE')
          this.success = true
        } catch (error) {
          this.success = false
          const type = _.get(error, 'errors.$className')
          switch (type) {
            case 'isNotVerified':
            case 'nothingToVerify':
              this.message = this.$t('KResendVerifySignup.ERROR_MESSAGE_NOTHING_TO_VERIFY')
              break
            default:
              this.message = this.$t('KResendVerifySignup.ERROR_MESSAGE_DEFAULT')
          }
        }
        this.sent = true
        this.sending = false
      }
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-screen'] = this.$load('frame/KScreen')
    this.$options.components['k-form'] = this.$load('form/KForm')
    // Components initialization
    this.message = this.$t('KResendVerifySignup.MESSAGE')
  }
}
</script>
