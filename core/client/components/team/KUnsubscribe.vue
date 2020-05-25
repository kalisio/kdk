<template>
  <k-screen :title="$t('KUnsubscribe.TITLE')">
    <div slot="screen-content">
      <!--
        Subscription
       -->
      <template v-if="status === 'pending' || status === 'running'">
        <div class="column justify-center xs-gutter">
          <k-form ref="form" :schema="schema" />
          <div class="row justify-around q-pa-sm">
            <q-btn color="primary" :loading="status === 'running'" @click="onUnsubscribe">
              {{$t('KUnsubscribe.APPLY_BUTTON')}}
            </q-btn>
          </div>
        </div>
      </template>
      <!--
        Confirmation
      -->
      <template v-else>

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
      status: 'pending', // running or finished
      schema: {
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
            // format: 'phone',
            field: {
              component: 'form/KPhoneField',
              helper: 'KSubscribe.PHONE_FIELD_HELPER'
            }
          }
        },
        required: ['name', 'phone']
      }
    }
  },
  methods: {
    async onUnsubscribe () {
      const result = this.$refs.form.validate()
      if (result.isValid) {
        this.unsubscribing = true
      }
    }
  },
  created () {
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
