<template>
  <k-modal
    id="add-view-modal"
    :title="$t(getSchema().title)"
    :buttons="getButtons()"
    v-model="isModalOpened"
    @opened="$emit('opened')"
    @closed="$emit('closed')"
  >
    <k-form ref="form" :schema="getSchema()" />
  </k-modal>
</template>

<script>
import mixins from '../../../../core/client/mixins'

export default {
  name: 'k-add-view',
  mixins: [mixins.baseModal],
  inject: ['kActivity'],
  data () {
    return {
      creating: false
    }
  },
  methods: {
    getButtons () {
      return [
        { id: 'cancel-button', label: 'CANCEL', renderer: 'form-button', outline: true, handler: () => this.closeModal() },
        { id: 'apply-button', label: 'CREATE', renderer: 'form-button', loading: this.creating, handler: () => this.apply() }
      ]
    },
    getSchema () {
      return {
        $schema: 'http://json-schema.org/draft-06/schema#',
        $id: 'http://www.kalisio.xyz/schemas/favorite-view.create.json#',
        title: 'schemas.CREATE_VIEW_TITLE',
        description: 'Map view creation schema',
        type: 'object',
        properties: {
          name: {
            type: 'string',
            maxLength: 128,
            minLength: 3,
            field: {
              component: 'form/KTextField',
              label: 'schemas.CREATE_VIEW_NAME_FIELD_LABEL'
            }
          },
          description: {
            type: 'string',
            maxLength: 256,
            field: {
              component: 'form/KTextField',
              label: 'schemas.CREATE_VIEW_DESCRIPTION_FIELD_LABEL'
            }
          },
          layers: {
            type: 'boolean',
            default: false,
            field: {
              component: 'form/KToggleField',
              label: 'schemas.CREATE_VIEW_LAYERS_FIELD_LABEL'
            }
          }
        },
        required: ['name']
      }
    },
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
    }
  },
  beforeCreate () {
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-form'] = this.$load('form/KForm')
  }
}
</script>