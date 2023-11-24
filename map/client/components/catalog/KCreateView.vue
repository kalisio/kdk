<template>
  <div>
    <!-- Forms section -->
    <k-form
      ref="form"
      :schema="formSchema"
    />
    <!-- Buttons section -->
    <q-card-actions align="right">
      <KPanel
        id="modal-buttons"
        :content="buttons"
        renderer="form-button"
        v-bind:class="{ 'q-gutter-x-md' : $q.screen.gt.xs, 'q-gutter-x-sm': $q.screen.lt.sm }"
      />
    </q-card-actions>
  </div>
</template>

<script>
import { KPanel, KForm } from '../../../../core/client/components'
import { useProject } from '../../composables'

export default {
  components: {
    KPanel,
    KForm
  },
  emits: [
    'done'
  ],
  inject: ['kActivity'],
  props: {
    contextId: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      creating: false
    }
  },
  computed: {
    buttons () {
      return [{
        id: 'close-action',
        outline: true,
        label: 'CLOSE',
        renderer: 'form-button',
        handler: this.onClose
      }, {
        id: 'create-view-action',
        label: 'CREATE',
        loading: this.creating,
        renderer: 'form-button',
        handler: this.onCreate
      }]
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
    onClose () {
      this.$emit('done')
    },
    async onCreate () {
      const result = this.$refs.form.validate()
      if (result.isValid) {
        const view = result.values
        try {
          this.creating = true
          const createdView = await this.kActivity.saveContext(view)
          // Add view to current project ?
          if (this.project) {
            this.project.views.push({ _id: createdView._id })
            await this.$api.getService('projects').patch(this.project._id, {
              views: this.project.views
            })
          }
          this.creating = false
          this.$emit('done')
        } catch (error) {
          this.creating = false
          this.$emit('done')
          throw error
        }
      }
    }
  },
  // Should be used with <Suspense> to ensure the project is loaded upfront
  async setup (props) {
    const project = useProject()
    await project.loadProject({ context: props.contextId })
    // Expose
    return {
      ...project
    }
  }
}
</script>
