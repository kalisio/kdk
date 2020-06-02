<template>
  <k-screen :title="title">
    <div slot="screen-content">
      <!--
        Subscription stage
       -->
      <template v-if="stage === 'subscription'">
        <div class="column justify-center xs-gutter">
          <k-form ref="form" :schema="getSubscriptionSchema()" />
          <div class="row justify-around q-pa-md">
            <q-btn color="primary" :loading="processing" @click="onSubscribe">
              {{$t('KSubscribe.SUBSCRIBE_BUTTON')}}
            </q-btn>
          </div>
        </div>
      </template>
      <!--
        Validation stage
       -->
      <template v-if="stage === 'validation'">
        <k-code-input v-model="code" />
        <div class="row justify-around q-pa-md">
          <q-btn color="primary" @click="stage = 'subscription'">
            {{$t('KSubscribe.CANCEL_BUTTON')}}
          </q-btn>
          <q-btn color="primary" :loading="processing" :disable="!code" @click="onValidate">
            {{$t('KSubscribe.VALIDATE_BUTTON')}}
          </q-btn>
        </div>
      </template>
      <!--
        Confirmation stage
      -->
      <template v-if="stage === 'confirmation'">
        <div class="row justify-around q-pa-md">
          <q-btn color="primary" @click="stage = 'subscription'">
            {{$t('KSubscribe.CONFIRM_BUTTON')}}
          </q-btn>
        </div>
      </template>
    </div>
  </k-screen>
</template>

<script>
import logger from 'loglevel'
import _ from 'lodash'

export default {
  name: 'k-subscribe',
  props: {
    contextId: {
      type: String,
      required: true
    },
    contextData: {
      type: String,
      required: true
    }
  },
  computed: {
    title () {
      const organisation = this.organisation.name
      if (this.stage === 'subscription') return this.$t('KSubscribe.SUBSCRIPTION_TITLE', { organisation })
      if (this.stage === 'validation') return this.$t('KSubscribe.VALIDATION_TITLE', { organisation })
      return this.$t('KSubscribe.CONFIRMATION_TITLE', { organisation })
    }
  },
  data () {
    return {
      organisation: {
        name: ''
      },
      stage: 'subscription',
      code: undefined,
      processing: false
    }
  },
  methods: {
    getSubscriptionSchema () {
      return {
        $schema: 'http://json-schema.org/draft-06/schema#',
        $id: 'http://kalisio.xyz/schemas/subscribe#',
        title: 'Subscribe form',
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 3,
            maxLength: 128,
            field: {
              component: 'form/KTextField',
              helper: 'KSubscribe.NAME_FIELD_HELPER'
            }
          },
          phone: {
            type: 'string',
            minLength: 7,
            maxLength: 15,
            field: {
              component: 'form/KPhoneField',
              helper: 'KSubscribe.PHONE_FIELD_HELPER'
            }
          },
          consentTerms: {
            type: 'boolean',
            default: false,
            enum: [true],
            field: {
              component: 'form/KToggleField',
              helper: this.$t('KRegister.ACCEPT_TERMS_HELPER', { domain: this.$config('domain') }),
              errorLabel: this.$t('KRegister.ACCEPT_TERMS_ERROR_LABEL', { domain: this.$config('domain') }),
              'checked-icon': 'check',
              'unchecked-icon': 'clear'
            }
          }
        },
        required: ['name', 'phone', 'consentTerms']
      }
    },
    async onSubscribe () {
      const result = this.$refs.form.validate()
      if (result.isValid) {
        this.processing = true
        const subscribersService = this.$api.getService('subscribers', this.contextId)
        try {
          await subscribersService.create(result.values)
          this.processing = false
          this.stage = 'validation'
        } catch (error) {
          logger.error(error)
          this.processing = false
        }
      }
    },
    onValidate () {
      this.processing = true
      // TODO: Perform the validation
      this.processing = false
      this.stage = 'confirmation'
    }
  },
  async created () {
    // Load the required components
    this.$options.components['k-screen'] = this.$load('frame/KScreen')
    this.$options.components['k-form'] = this.$load('form/KForm')
    this.$options.components['k-code-input'] = this.$load('input/KCodeInput')
    // Retrieve context data
    try {
      const decodedContextData = JSON.parse(atob(this.contextData))
      this.organisation.name = _.get(decodedContextData, 'name')
    } catch (error) {
      logger.error(`Invalid context data ${error}`)
    }
  }
}
</script>
