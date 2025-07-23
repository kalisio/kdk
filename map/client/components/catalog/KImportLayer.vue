<template>
  <div>
    <!-- Forms section -->
    <KForm
      ref="fileForm"
      :schema="fileFormSchema"
      @field-changed="onFileFormFieldChanged"
    />
    <KForm
      ref="propertiesForm"
      :schema="propertiesFormSchema"
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
import _ from 'lodash'
import path from 'path-browserify'
import { ref, computed } from 'vue'
import { generatePropertiesSchema } from '../../utils'
import { Events, i18n } from '../../../../core/client'
import { KPanel } from '../../../../core/client/components'
import { useCurrentActivity } from '../../composables'
import KForm from '../../../../core/client/components/form/KForm.vue'

// Emits
const emit = defineEmits(['done'])

// Data
const { CurrentActivity } = useCurrentActivity()
const fileForm = ref(null)
const propertiesForm = ref(null)
const importing = ref(false)
const filename = ref('')
let file = null

// Computed
const fileFormSchema = computed(() => {
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'http://kalisio.xyz/schemas/import-layer-select-file#',
    type: 'object',
    properties: {
      file: {
        type: 'object',
        field: {
          component: 'form/KFileField',
          label: 'KImportLayer.FILE_FIELD_LABEL',
          mimeTypes: '.json,.geojson,.gpx,.kml',
          maxSize: 1024 * 1024 * 1024
        }
      }
    },
    required: ['file']
  }
})
const propertiesFormSchema = computed(() => {
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'http://kalisio.xyz/schemas/import-layer-set-properties#',
    type: 'object',
    properties: {
      name: {
        type: 'string',
        maxLength: 128,
        minLength: 2,
        default: filename.value,
        field: {
          component: 'form/KTextField',
          label: 'KImportLayer.NAME_FIELD_LABEL'
        }
      },
      description: {
        type: ['string', 'null'],
        default: filename.value,
        field: {
          component: 'form/KTextField',
          label: 'KImportLayer.DESCRIPTION_FIELD_LABEL'
        }
      },
      featureId: {
        type: ['string', 'null'],
        default: guessFeatureId(),
        field: {
          component: 'form/KSelectField',
          label: 'KImportLayer.FEATURE_ID_FIELD_LABEL',
          options: getProperties()
        }
      }
    },
    required: ['name']
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
    id: 'import-layer-action',
    label: i18n.t('KImportLayer.IMPORT_BUTTON'),
    loading: importing.value,
    renderer: 'form-button',
    handler: onImport
  }]
})

// Functions
function onFileFormFieldChanged (field, value) {
  file = value
  filename.value = path.basename(file.name, path.extname(file.name))
  if (value) {
    file.schema = generatePropertiesSchema(value.content, value.name)
  }
}
function getProperties () {
  if (file) {
    const properties = _.keys(_.get(file, 'schema.properties', {}))
    return _.map(properties, prop => { return { label: prop, value: prop } })
  }
  return []
}
function guessFeatureId () {
  if (file) {
    const properties = _.keys(_.get(file, 'schema.properties', {}))
    for (const prop of properties) {
      if (_.indexOf(['id', 'fid', 'featureid', '_id', 'objectid'], prop.toLowerCase()) >= 0) return prop
    }
  }
  return ''
}
function onClose () {
  emit('done')
}
async function onImport () {
  const fileResult = fileForm.value.validate()
  const propertiesResult = propertiesForm.value.validate()
  if (!fileResult.isValid || !propertiesResult.isValid) return
  if (CurrentActivity.value.hasLayer(propertiesResult.values.name)) {
    Events.emit('error', { message: i18n.t('KImportLayer.LAYER_ALREADY_EXISTS', { layer: propertiesResult.values.name }) })
  }
  importing.value = true
  await CurrentActivity.value.addGeoJsonLayer({
    name: propertiesResult.values.name,
    description: propertiesResult.values.description,
    schema: { name: file.name, content: file.schema },
    featureId: propertiesResult.values.featureId
  }, file.content)
  if (typeof CurrentActivity.value.refreshOrphanLayers === 'function') await CurrentActivity.value.refreshOrphanLayers()
  importing.value = false
  emit('done')
}
</script>
