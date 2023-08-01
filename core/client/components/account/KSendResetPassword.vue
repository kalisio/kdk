<template>
  <KScreen :title="$t('KSendResetPassword.TITLE')">
    <div slot="screen-content">
      <div class="column justify-center sm-gutter">
          <div :class="textClass" v-if="message">
            <p>
              <q-icon name="las la-exclamation-circle" v-show="send"/>
              &nbsp;&nbsp;
              {{ message }}.
            </p>
          </div>
          <div>
            <k-form ref="form" :schema="schema" />
          </div>
          <div>
            <div class="row justify-around">
              <q-btn id="reset-password" color="primary" :loading="sending" @click="onSend">
                {{$t('KSendResetPassword.ACTION')}}
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

export default {
  name: 'k-send-reset-password',
  components: {
    KScreen,
    KForm
  },
  mixins: [account],
  data () {
    return {
      message: '',
      sending: false,
      send: false,
      schema: {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: 'http://kalisio.xyz/schemas/send-reset-password#',
        title: 'Send reset password form',
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            field: {
              component: 'form/KEmailField',
              label: 'KSendResetPassword.EMAIL_FIELD_LABEL'
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
      classObject['self-center'] = true
      if (this.send) {
        classObject['text-negative'] = true
      }
      return classObject
    }
  },
  methods: {
    async onSend () {
      const {isValid, values} = this.$refs.form.validate()
      if (isValid) {
        try {
          this.sending = true
          console.log(values.email)
          await this.sendResetPassword(values.email)
          this.$router.push({ path: `reset-password/${values.email}` })
        } catch (error) {
          console.log(error)
          const type = _.get(error, 'errors.$className')
          switch (type) {
            case 'isVerified':
              this.message = this.$t('KSendResetPassword.ERROR_MESSAGE_IS_VERIFIED')
              break
            default:
              this.message = this.$t('KSendResetPassword.ERROR_MESSAGE_DEFAULT')
          }
        }
        this.send = true
        this.sending = false
      }
    }
  },
  created () {
    // Components initialization
    this.message = this.$t('KSendResetPassword.MESSAGE')
  }
}
</script>
