<template>
  <k-screen :title="title">
    <div slot="screen-content">
      <!--
        Ubsubscription stage
       -->
      <template v-if="stage === 'unsubscription'">
        <div class="column justify-center xs-gutter">
          <k-form ref="form" :schema="getUnsubscriptionSchema()" />
          <div class="row justify-around q-pa-md">
            <q-btn color="primary" :loading="processing" @click="onUnsubscribe">
              {{$t('KUnsubscribe.UNSUBSCRIBE_BUTTON')}}
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
          <q-btn color="primary" @click="stage = 'unsubscription'">
            {{$t('KUnsubscribe.CANCEL_BUTTON')}}
          </q-btn>
          <q-btn color="primary" :loading="processing" :disable="!code" @click="onValidate">
            {{$t('KUnsubscribe.VALIDATE_BUTTON')}}
          </q-btn>
        </div>
      </template>
      <!--
        Confirmation stage
      -->
      <template v-if="stage === 'confirmation'">
        <div class="row justify-around q-pa-md">
          <q-btn color="primary" @click="stage = 'unsubscription'">
            {{$t('KUnsubscribe.CONFIRM_BUTTON')}}
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
  name: 'k-unsubscribe',
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
      if (this.stage === 'unsubscription') return this.$t('KUnsubscribe.UNSUBSCRIPTION_TITLE', { organisation })
      if (this.stage === 'validation') return this.$t('KUnsubscribe.VALIDATION_TITLE', { organisation })
      return this.$t('KUnsubscribe.CONFIRMATION_TITLE', { organisation })
    }
  },
  data () {
    return {
      organisation: {
        name: ''
      },
      stage: 'unsubscription',
      code: undefined,
      processing: false
    }
  },
  methods: {
    getUnsubscriptionSchema () {
      return {
        $schema: 'http://json-schema.org/draft-06/schema#',
        $id: 'http://kalisio.xyz/schemas/unsubscribe#',
        title: 'Unsubscribe form',
        type: 'object',
        properties: {
          phone: {
            type: 'string',
            minLength: 7,
            maxLength: 15,
            field: {
              component: 'form/KPhoneField',
              helper: 'KSubscribe.PHONE_FIELD_HELPER'
            }
          }
        },
        required: ['phone']
      }
    },
    async onUnsubscribe () {
      const result = this.$refs.form.validate()
        if (result.isValid) {
        this.processing = true
        try {
          // SMS 
          this.processing = false
          this.phone = result.values.phone
          this.stage = 'validation'
        } catch (error) {
          logger.error(error)
          this.processing = false
        }
      }
    },
    async onValidate () {
      this.processing = true
      const subscribersService = this.$api.getService('subscribers', this.contextId)
      try {
        await subscribersService.remove(this.phone, { query: { code: this.code }})
        this.stage = 'confirmation'
      } catch (error) {
        logger.error(error)
        this.stage = 'unsubscription'
      }
      this.processing = false
    }
  },
  created () {
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
