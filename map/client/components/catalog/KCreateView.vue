<template>
  <k-modal
    id="add-view-modal"
    title="KCreateView.MODAL_TITLE"
    :buttons="modalButtons"
    v-model="isModalOpened"
  >
    <!-- 
      Modal content
    -->
    <k-form 
      ref="form" 
      :schema="formSchema" 
      @form-ready="onFormReady" 
    />
  </k-modal>
</template>

<script>
import { KModal, KForm } from '../../../../core/client/components'
import { baseModal } from '../../../../core/client/mixins'

export default {
  components: {
    KModal,
    KForm
  },
  mixins: [baseModal],
  inject: ['kActivity'],
  data () {
    return {
      enabled: false,
      creating: false
    }
  },
  computed: {
    modalButtons () {
      return [
        { 
          id: 'cancel-button', 
          label: 'CANCEL', 
          renderer: 'form-button', 
          outline: true, 
          disabled: !this.enabled, 
          handler: () => this.closeModal() 
        },
        { 
          id: 'apply-button', 
          label: 'CREATE', 
          renderer: 'form-button', 
          loading: this.creating, 
          disabled: !this.enabled, 
          handler: () => this.apply() 
        }
      ]
    },
    formSchema () {
      return {
        $schema: 'http://json-schema.org/draft-06/schema#',
        $id: 'http://www.kalisio.xyz/schemas/favorite-view.create.json#',
        description: 'Map view creation schema',
        type: 'object',
        properties: {
          name: {
            type: 'string',
            maxLength: 128,
            minLength: 3,
            field: {
              component: 'form/KTextField',
              label: 'KCreateView.NAME_FIELD_LABEL'
            }
          },
          description: {
            type: 'string',
            maxLength: 256,
            field: {
              component: 'form/KTextField',
              label: 'KCreateView.DESCRIPTION_FIELD_LABEL'
            }
          },
          layers: {
            type: 'boolean',
            default: false,
            field: {
              component: 'form/KToggleField',
              label: 'KCreateView.LAYERS_FIELD_LABEL'
            }
          }
        },
        required: ['name']
      }
    }
  },
  methods: {
    async apply () {
      const result = this.$refs.form.validate()
      if (result.isValid) {
        const view = result.values
        try {
          this.creating = true
          await this.kActivity.saveContext(view)
          this.creating = false
          this.closeModal()
        } catch (error) {
          this.creating = false
          throw error
        }
      }
    },
    onFormReady () {
      this.enabled = true
    }
  }
}
</script>
