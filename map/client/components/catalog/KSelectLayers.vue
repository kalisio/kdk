<template>
  <div>
    <!-- Forms section -->
    <KForm
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

<script setup>
import { ref, computed } from 'vue'
import { api, i18n } from '../../../../core/client'
import { KForm, KPanel } from '../../../../core/client/components'
import { useProject } from '../../composables'

// Data
const layersForm = ref(null)
const { project, projectId } = await getProject()

// Emits
const emit = defineEmits(['done'])

// Computed
const layersFormSchema = computed(() => {
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
})
const buttons = computed(() => {
  return [{
    id: 'close-action',
    outline: true,
    label: 'CLOSE',
    renderer: 'form-button',
    handler: onClose
  }, {
    id: 'select-layers-action',
    label: i18n.t('KSelectLayers.SELECT_BUTTON'),
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
  const layersResult = layersForm.value.validate()
  if (!layersResult.isValid) return
  const projectService = api.getService('projects')
  await projectService.patch(projectId.value, { layers: layersResult.values.layers })
  emit('done')
}
</script>
