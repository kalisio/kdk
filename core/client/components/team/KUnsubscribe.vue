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
            field: {
              component: 'form/KPhoneField',
              helper: 'KSubscribe.PHONE_FIELD_HELPER'
            }
          }
        },
        required: ['name', 'phone']
      }
    },
    async onUnsubscribe () {
      // const result = this.$refs.form.validate()
      this.processing = true
      // const subscribersServicePath = this.$api.getServicePath('subscribers', this.contextId)
      // const subscribersService = this.$api.service(subscribersServicePath)
      try {
        // TODO const subscribers = subscribersService.remove(TODO)
        this.processing = false
        this.stage = 'validation'
      } catch (error) {
        logger.error(error)
        this.processing = false
      }
    },
    onValidate () {
      this.processing = true
      // TODO: Perform the validation
      this.processing = false
      this.stage = 'confirmation'
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
