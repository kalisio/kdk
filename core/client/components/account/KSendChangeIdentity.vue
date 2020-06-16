<template>
  <k-screen :title="$t('KSendChangeIdentity.TITLE')">
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
              <q-btn id="change-identity" color="primary" :loading="sending" @click="onSend">
                {{$t('KSendChangeIdentity.ACTION')}}
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
  name: 'k-send-change-identity',
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
        $id: 'http://kalisio.xyz/schemas/send-change-identity#',
        title: 'Send change identity form',
        type: 'object',
        properties: {
          password: {
            type: 'string',
            field: {
              component: 'form/KPasswordField',
              helper: 'KSendChangeIdentity.PASSWORD_FIELD_HELPER'
            }
          },
          email: {
            type: 'string',
            format: 'email',
            field: {
              component: 'form/KEmailField',
              helper: 'KSendChangeIdentity.EMAIL_FIELD_HELPER'
            }
          }
        },
        required: ['email', 'password']
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
          await this.sendChangeIdentity(this.$store.get('user.email'), result.values.email, result.values.password)
          this.message = this.$t('KSendChangeIdentity.SUCCESS_MESSAGE')
          this.success = true
        } catch (error) {
          const type = _.get(error, 'errors.$className')
          const password = _.get(error, 'errors.password')
          switch (type) {
            case 'badParams':
              this.message = this.$t(password ? 'KSendChangeIdentity.ERROR_MESSAGE_BAD_PASSWORD' : 'KSendChangeIdentity.ERROR_MESSAGE_BAD_PARAMS')
              break
            default:
              this.message = this.$t('KSendChangeIdentity.ERROR_MESSAGE_DEFAULT')
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
    this.message = this.$t('KSendChangeIdentity.MESSAGE')
  }
}
</script>
