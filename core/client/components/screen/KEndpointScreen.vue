<template>
  <KScreen title="KEndpointScreen.TITLE" :actions="actions">
    <div class="column items-center q-gutter-y-md">
      <KForm
        ref="form"
        class="full-width"
        :schema="getFormSchema()"
        @form-ready="onFormReady"
      />
      <div class="row full-width justify-around q-gutter-x-md">
        </KCardSection
          id="cancel-button"
          label="KEndpointScreen.RESET_LABEL"
          renderer="form-button"
          :handler="this.onReset"
        />
        </KCardSection
          id="apply-button"
          label="KEndpointScreen.APPLY_LABEL"
          renderer="form-button"
          :handler="this.onApplied"
        />
      </div>
    </div>
  </KScreen>
</template>

<script>
import KScreen from './KScreen.vue'
import KForm from '../form/KForm.vue'
import KAction from '../frame/KAction.vue'

export default {
  components: {
    KScreen,
    KForm,
    KAction
  },
  data () {
    return {
      actions: []
    }
  },
  methods: {
    getFormSchema () {
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
    },
    onReset () {
      this.$api.setBaseUrl('')
      this.$router.push({ name: 'login' })
      window.location.reload()
    },
    onApplied (data) {
      const result = this.$refs.form.validate()
      if (result.isValid) {
        this.$api.setBaseUrl(result.values.baseUrl)
        this.$router.push({ name: 'login' })
        window.location.reload()
      }
    },
    onCanceled () {
      this.$router.push({ name: 'login' })
    },
    onFormReady (form) {
      this.$refs.form.fill({
        baseUrl: this.$api.getBaseUrl()
      })
    }
  },
  async created () {
    // Configure this screen
    this.actions = this.$config('screens.endpoint.actions', this.action)
  }
}
</script>
