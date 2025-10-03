<template>
  <k-modal
    id="create-view-modal"
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
    />
  </k-modal>
</template>

<script>
import { KModal, KForm } from '../../../../core/client/components'
import { baseModal } from '../../../../core/client/mixins'
import { api } from '../../../../core/client/api.js'
import { useProject } from '../../composables'

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
            type: ['string', 'null'],
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
          const createdView = await this.kActivity.saveContext(view)
          // Add view to current project ? Check if not coming from another planet first
          if (this.project && (this.project.getPlanetApi() === api)) {
            this.project.views.push({ _id: createdView._id })
            await api.getService('projects').patch(this.project._id, {
              views: this.project.views
            })
          }
          this.creating = false
          this.closeModal()
        } catch (error) {
          this.creating = false
          throw error
        }
      }
    }
  },
  // Should be used with <Suspense> to ensure the project is loaded upfront
  async setup (props) {
    const project = useProject()
    await project.loadProject({ populate: false })
    // Expose
    return {
      ...project
    }
  }
}
</script>
