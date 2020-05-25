<template>
  <k-screen :title="$t('KSubscribe.TITLE', { organisation: organisation.name })">
    <div slot="screen-content">
      <!--
        Subscription
       -->
      <template v-if="status === 'pending' || status === 'running'">
        <div class="column justify-center xs-gutter">
          <k-form ref="form" :schema="subscriptionSchema" />
          <div class="row justify-around q-pa-sm">
            <q-btn color="primary" :loading="status === 'running'" @click="onSubscribe">
              {{$t('KSubscribe.APPLY_BUTTON')}}
            </q-btn>
          </div>
        </div>
      </template>
      <!--
        Confirmation
       -->
      <template v-else>
        <k-form ref="form" :schema="confirmationSchema" />
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
  data () {
    return {
      organisation: {
        name: ''
      },
      status: 'pending', // running or finished
      subscriptionSchema: {
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
            field: {
              component: 'form/KPhoneField',
              helper: 'KSubscribe.PHONE_FIELD_HELPER'
            }
          }
        },
        required: ['name', 'phone']
      },
      confirmationSchema: {
        $schema: 'http://json-schema.org/draft-06/schema#',
        $id: 'http://kalisio.xyz/schemas/confimr-subscribtion#',
        title: 'Subscription confirmation form',
        type: 'object',
        properties: {
          name: {
            type: 'number',
            field: {
              component: 'form/KTextField',
              helper: 'KSubscribe.CODE_FIELD_HELPER'
            }
          }
        },
        required: ['number']
      }
    }
  },
  methods: {
    async onSubscribe () {
      const result = this.$refs.form.validate()
      if (result.isValid) {
        this.status = 'running'
        const subscribersServicePath = this.$api.getServicePath('subscribers', this.contextId)
        const subscribersService = this.$api.service(subscribersServicePath)
        await subscribersService.create(result.values)
        this.status = 'finished'
      }
    }
  },
  async created () {
    // Load the required components
    this.$options.components['k-screen'] = this.$load('frame/KScreen')
    this.$options.components['k-form'] = this.$load('form/KForm')
    // Retrieve context data
    try {
      const decondedContextData = JSON.parse(atob(this.contextData))
      this.organisation.name = _.get(decondedContextData, 'name')
    } catch (error) {
      logger.error(`Invalid context data ${error}`)
    }
  }
}
</script>
