<template>
  <k-modal
    id="add-project-modal"
    title="KCreateProject.MODAL_TITLE"
    :buttons="modalButtons"
    v-model="isModalOpened"
  >
    <!--
      Modal content
    -->
    <k-form
      ref="form"
      :schema="formSchema"
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
          handler: () => this.closeModal()
        },
        {
          id: 'apply-button',
          label: 'CREATE',
          renderer: 'form-button',
          loading: this.creating,
          handler: () => this.apply()
        }
      ]
    },
    formSchema () {
      return {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: 'http://www.kalisio.xyz/schemas/projects.create.json#',
        description: 'Map project creation schema',
        type: 'object',
        properties: {
          name: {
            type: 'string',
            maxLength: 128,
            minLength: 3,
            field: {
              component: 'form/KTextField',
              label: 'KCreateProject.NAME_FIELD_LABEL'
            }
          },
          description: {
            type: 'string',
            maxLength: 256,
            field: {
              component: 'form/KTextField',
              label: 'KCreateProject.DESCRIPTION_FIELD_LABEL'
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
    }
  }
}
</script>
