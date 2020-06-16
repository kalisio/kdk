<template>
  <k-screen :title="$t('KSendResetPassword.TITLE')">
    <div slot="screen-content">
      <div class="column justify-center sm-gutter">
          <div :class="textClass">
            <p>
              <q-icon name="las la-check" v-show="sent && success"/>
              <q-icon name="las la-exclamation-circle" v-show="sent && !success"/>
              &nbsp;&nbsp;
              {{ message }}.
            </p>
          </div>
          <div>
            <k-form ref="form" :schema="schema" />
          </div>
          <div>
            <div class="row justify-around">
              <q-btn color="primary" :loading="sending" @click="onSend">
                {{$t('KSendResetPassword.ACTION')}}
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
  name: 'k-send-reset-password',
  mixins: [
    mixins.account
  ],
  data () {
    return {
      message: '',
      success: false,
      sent: false,
      sending: false,
      schema: {
        $schema: 'http://json-schema.org/draft-06/schema#',
        $id: 'http://kalisio.xyz/schemas/send-reset-password#',
        title: 'Send reset password form',
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            field: {
              component: 'form/KEmailField',
              helper: 'KSendResetPassword.EMAIL_FIELD_HELPER'
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
          await this.sendResetPassword(result.values.email)
          this.message = this.$t('KSendResetPassword.SUCCESS_MESSAGE')
          this.success = true
        } catch (error) {
          const type = _.get(error, 'errors.$className')
          switch (type) {
            case 'isVerified':
              this.message = this.$t('KSendResetPassword.ERROR_MESSAGE_IS_VERIFIED')
              break
            default:
              this.message = this.$t('KSendResetPassword.ERROR_MESSAGE_DEFAULT')
          }
          this.success = false
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
    this.message = this.$t('KSendResetPassword.MESSAGE')
  }
}
</script>
