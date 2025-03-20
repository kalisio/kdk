<template>
  <div>
    <!-- Forms section -->
    <KForm
      ref="propertiesForm"
      :schema="propertiesFormSchema"
      @field-changed="onPropertiesFormFieldChanged"
    />
    <KForm
      ref="featureIdForm"
      :schema="featureIdFormSchema"
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
import { ref, computed } from 'vue'
import { i18n } from '../../../../core/client'
import { KPanel, KForm } from '../../../../core/client/components'
import { useCurrentActivity } from '../../composables'

// Emits
const emit = defineEmits(['done'])

// Data
const { CurrentActivity } = useCurrentActivity()
const propertiesForm = ref(null)
const featureIdForm = ref(null)
const schema = ref(null)
const featureIdFormKey = ref(1)
const creating = ref(false)

// Computed
const propertiesFormSchema = computed(() => {
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'http://kalisio.xyz/schemas/create-layer-set-properties#',
    type: 'object',
    properties: {
      name: {
        type: 'string',
        maxLength: 128,
        minLength: 2,
        field: {
          component: 'form/KTextField',
          label: 'KCreateLayer.NAME_FIELD_LABEL'
        }
      },
      description: {
        type: 'string',
        field: {
          component: 'form/KTextField',
          label: 'KCreateLayer.DESCRIPTION_FIELD_LABEL'
        }
      },
      schema: {
        type: 'object',
        field: {
          component: 'form/KFileField',
          label: 'KCreateLayer.CATALOG_SCHEMA_FIELD_LABEL',
          mimeTypes: 'application/json'
        }
      }
    },
    required: ['name']
  }
})
const featureIdFormSchema = computed(() => {
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    $id: 'http://kalisio.xyz/schemas/create-layer-set-feature-id#',
    type: 'object',
    properties: {
      featureId: {
        type: 'string',
        default: guessFeatureId(),
        field: {
          component: 'form/KSelectField',
          label: 'KCreateLayer.FEATURE_ID_FIELD_LABEL',
          options: getProperties()
        }
      }
    },
    required: []
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
    id: 'create-layer-action',
    label: i18n.t('KCreateLayer.CREATE_BUTTON'),
    loading: creating.value,
    renderer: 'form-button',
    handler: onCreate
  }]
})

// Functions
function onPropertiesFormFieldChanged (field, value) {
  if (field === 'schema') {
    schema.value = value
    featureIdFormKey.value += 1
  }
}
function getProperties () {
  if (schema.value) {
    const properties = _.keys(_.get(schema.value, 'content.properties', {}))
    return _.map(properties, prop => { return { label: prop, value: prop } })
  }
  return []
}
function guessFeatureId () {
  if (schema.value) {
    const properties = _.keys(_.get(schema.value, 'content.properties', {}))
    for (const prop of properties) {
      if (prop.toLowerCase().includes('id', 'fid', 'featureid', '_id', 'objectid')) return prop
    }
  }
  return ''
}
function onClose () {
  emit('done')
}
async function onCreate () {
  const propertiesResult = propertiesForm.value.validate()
  const featureIdResult = featureIdForm.value.validate()
  if (!propertiesResult.isValid || !featureIdResult.isValid) return
  creating.value = true
  // Create an empty layer
  const engine = {
    type: 'geoJson',
    isVisible: true,
    realtime: true
  }
  const newLayer = {
    name: propertiesResult.values.name,
    description: propertiesResult.values.description,
    type: 'OverlayLayer',
    icon: 'insert_drive_file',
    scope: 'user',
    isDataEditable: true, // Flag as editable
    featureId: featureIdResult.values.featureId,
    leaflet: engine,
    // Avoid sharing reference to the same object although options are similar
    // otherwise updating one will automatically update the other one
    cesium: Object.assign({}, engine)
  }
  if (schema.value) {
    Object.assign(newLayer, {
      schema: {
        name: schema.value.name,
        content: schema.value.content
      }
    })
  }
  // Create the layer
  await CurrentActivity.value.addLayer(newLayer)
  // Start editing
  await CurrentActivity.value.onEditLayerData(newLayer)
  creating.value = false
  emit('done')
}
</script>
