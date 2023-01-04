<template>
  <KScreen title="KEndpointScreen.TITLE" :actions="actions">
    <div class="column items-center q-gutter-y-md">
      <KForm
        ref="refForm"
        class="full-width"
        :schema="getFormSchema()"
        @form-ready="onFormReady"
      />
      <div class="row full-width justify-around q-gutter-x-md">
        <KAction
          id="cancel-button"
          label="KEndpointScreen.RESET_LABEL"
          renderer="form-button"
          :handler="onReset"
        />
        <KAction
          id="apply-button"
          label="KEndpointScreen.APPLY_LABEL"
          renderer="form-button"
          :handler="onApplied"
        />
      </div>
    </div>
  </KScreen>
</template>

<script setup>
import _ from 'lodash'
import config from 'config'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../../api.js'
import KScreen from './KScreen.vue'
import KForm from '../form/KForm.vue'
import KAction from '../KAction.vue'

// Data
const router = useRouter()
const refForm = ref()
const actions = ref(_.get(config, 'screens.endpoint.actions', []))

// Functions
function getFormSchema () {
  return {
    $schema: 'http://json-schema.org/draft-06/schema#',
    $id: 'http://kalisio.xyz/schemas/change-endpoint.json#',
    title: 'Change Endpoint form',
    description: 'Change remote service URL form',
    type: 'object',
    properties: {
      baseUrl: {
        type: 'string',
        format: 'uri',
        field: {
          component: 'form/KTextField',
          label: 'KEndpointScreen.BASE_URL_FIELD_LABEL'
        }
      }
    },
    required: ['baseUrl']
  }
}
function onReset () {
  api.setBaseUrl('')
  router.push({ name: 'login' })
  window.location.reload()
}
function onApplied (data) {
  const result = refForm.value.validate()
  if (result.isValid) {
    api.setBaseUrl(result.values.baseUrl)
    window.location.reload()
  }
}
function onFormReady (form) {
  refForm.value.fill({
    baseUrl: api.getBaseUrl()
  })
}
</script>
