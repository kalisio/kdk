<template>
  <div>
    <!-- Forms section -->
    <k-form
      ref="layersForm"
      :schema="layersFormSchema"
      :values="project"
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
import { KForm, KPanel } from '../../../../core/client/components'
import { useProject } from '../../composables'

export default {
  name: 'k-select-layers',
  components: {
    KForm,
    KPanel
  },
  emits: [
    'done'
  ],
  inject: ['kActivity'],
  computed: {
    layersFormSchema () {
      return {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: 'http://kalisio.xyz/schemas/select-layers#',
        type: 'object',
        properties: {
          layers: {
            type: 'array',
            field: {
              component: 'form/KSelectLayersField',
              label: 'KSelectLayers.LAYERS_FIELD_LABEL'
            }
          }
        },
        required: ['layers']
      }
    },
    buttons () {
      return [{
        id: 'close-action',
        outline: true,
        label: 'CLOSE',
        renderer: 'form-button',
        handler: this.onClose
      }, {
        id: 'select-layers-action',
        label: this.$t('KSelectLayers.SELECT_BUTTON'),
        renderer: 'form-button',
        handler: this.onSelect
      }]
    }
  },
  methods: {
    onClose () {
      this.$emit('done')
    },
    async onSelect () {
      const layersResult = this.$refs.layersForm.validate()
      if (!layersResult.isValid) return
      const projectService = this.$api.getService('projects')
      await projectService.patch(this.projectId, { layers: layersResult.values.layers })
      this.$emit('done')
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
