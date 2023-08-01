<template>
  <q-card>
    <!-- Form -->
    <q-card-section>
      <KForm
        ref="form"
        :schema="schema"
      />
    </q-card-section>
    <!-- Actions -->
    <q-card-actions align="center">
      <KAction
        id="verify-email"
        label="APPLY"
        renderer="form-button"
        outline
        :loading="processing"
        :handler="apply"
      />
      <KAction
        id="verify-email"
        label="KVerifyEmail.ACTION"
        renderer="form-button"
        outline
        :handler="resendToken"
      />
    </q-card-actions>
  </q-card>
</template>

<script>
import _ from 'lodash'
import { account } from '../../mixins'

export default {
  mixins: [account],
  data () {
    return {
      processing: false,
      schema: {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: 'http://kalisio.xyz/schemas/verify-email#',
        title: 'Verify email',
        type: 'object',
        properties: {
          token: {
            type: 'string',
            minLength: 6,
            maxLength: 6,
            tokenLength: 6,
            field: {
              component: 'form/KTokenField',
              label: 'KVerifyEmail.TOKEN_LABEL',
            }
          }
        },
        required: ['token']
      }
    }
  },
  computed: {
    userEmail () {
      return this.$store.get('user.email')
    }
  },
  methods: {
    async apply () {
      const result = this.$refs.form.validate()
      if (!result.isValid) return false
      try {
        this.processing = true
        await this.verifySignup(result.values.token, this.userEmail)
        this.processing = false
        this.$emit('close-popup')
        this.$notify({
          type: 'positive',
          message: this.$t('KVerifyEmail.EMAIL_VERIFIED')
        })
      } catch (error) {
        this.processing = false
        this.$notify({
          type: 'negative',
          message: this.$t('KVerifyEmail.ERROR_MESSAGE')
        })        
      }
    },
    resendToken () {
      this.resendVerifySignup(this.userEmail)
    }
  }
}
</script>