<template>
  <div>
    <!-- Forms section -->
    <KForm
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

<script setup>
import { ref, computed } from 'vue'
import { api, i18n } from '../../../../core/client'
import { KForm, KPanel } from '../../../../core/client/components'
import { useProject } from '../../composables'

// Data
const viewsForm = ref(null)
const project = await getProject()

// Emits
const emit = defineEmits(['done'])

// Computed
const viewsFormSchema = computed(() => {
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
})
const buttons = computed(() => {
  return [{
    id: 'close-action',
    outline: true,
    label: 'CLOSE',
    renderer: 'form-button',
    handler: onClose
  }, {
    id: 'select-views-action',
    label: i18n.t('KSelectViews.SELECT_BUTTON'),
    renderer: 'form-button',
    handler: onSelect
  }]
})

// Functions
async function getProject () {
  const project = useProject()
  await project.loadProject({ populate: false })
  return project
}
function onClose () {
  emit('done')
}
async function onSelect () {
  const viewsResult = viewsForm.value.validate()
  if (!viewsResult.isValid) return
  const projectService = api.getService('projects')
  await projectService.patch(project.projectId.value, { views: viewsResult.values.views })
  emit('done')
}
</script>
