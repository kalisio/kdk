<template>
  <div>
    <!-- Forms section -->
    <k-form
      ref="viewsForm"
      :schema="viewsFormSchema"
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
  name: 'k-select-views',
  components: {
    KForm,
    KPanel
  },
  emits: [
    'done'
  ],
  inject: ['kActivity'],
  computed: {
    viewsFormSchema () {
      return {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: 'http://kalisio.xyz/schemas/select-views#',
        type: 'object',
        properties: {
          views: {
            type: 'array',
            field: {
              component: 'form/KSelectViewsField',
              label: 'KSelectViews.VIEWS_FIELD_LABEL'
            }
          }
        },
        required: ['views']
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
        id: 'select-views-action',
        label: this.$t('KSelectViews.SELECT_BUTTON'),
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
      const viewsResult = this.$refs.viewsForm.validate()
      if (!viewsResult.isValid) return
      const projectService = this.$api.getService('projects')
      await projectService.patch(this.projectId, { views: viewsResult.values.views })
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
