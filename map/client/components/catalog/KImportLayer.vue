<template>
  <div>
    <!-- Form section -->
    <k-form ref="form" :schema="getSchema()" @field-changed="onFieldChanged" />
    <!-- Buttons section -->
    <div class="q-pt-md row justify-end">
      <q-btn id="import-button" color="primary" :label="$t('KImportLayer.IMPORT_BUTTON')" @click="onImport"/>
    </div>
  </div>
</template>

<script>
import path from 'path'
import { generatePropertiesSchema } from '../../utils'
import { uid } from 'quasar'

export default {
  name: 'k-import-layer',
  inject: ['kActivity'],
  props: {
    accept: {
      type: String,
      default: '.json,.geojson,application/json,application/geo+json'
    }
  },
  data () {
    return {
      pickedFile: null
    }
  },
  methods: {
    getSchema () {
      return {
        $schema: 'http://json-schema.org/draft-06/schema#',
        $id: 'http://kalisio.xyz/schemas/import-layer#',
        title: 'Import layer',
        type: 'object',
        properties: {
          file: { 
            type: 'object',
            field: {
              component: 'form/KFileField',
              label: 'KImportLayer.FILE_LABEL',
              mimeTypes: '.json,.geojson,application/json,application/geo+json'
            }
          },
          name: {
            type: 'string',
            maxLength: 128,
            minLength: 3,            
            field: { 
              component: 'form/KTextField',
              label: 'KImportLayer.NAME_LABEL'
            }
          },
          description: {
            type: 'string',
            field: { 
              component: 'form/KTextField',
              label: 'KImportLayer.DESCRIPTION_LABEL'
            }
          }
        },
        required: ['file', 'name']
      }
    },
    onFieldChanged (field, value) {
      // Setup workflow depending on field state
      if (field === 'file') {
        if (value) {
          const name = path.basename(value.name, path.extname(value.name))
          this.$refs.form.getField('name').fill(name)
        }
      }
    },
    async onImport () {
      const result = this.$refs.form.validate()
      if (result.isValid) {
        const file = result.values.file
        const geoJson = file.content
        // Create an empty layer used as a container
        const layer = {
          name: result.values.name,
          description: result.values.description,
          type: 'OverlayLayer',
          icon: 'insert_drive_file',
          featureId: '_id',
          [this.kActivity.engine]: {
            type: 'geoJson',
            isVisible: true,
            realtime: true
          },
          schema: {
            content: generatePropertiesSchema(geoJson, file.name)
          }
        }
        await this.kActivity.addLayer(layer)
        // Generate temporary IDs for features
        const features = (geoJson.type === 'FeatureCollection' ? geoJson.features : [geoJson])
        features.forEach(feature => { feature._id = uid().toString() })
        // Assign the features to the layer
        await this.kActivity.updateLayer(layer.name, geoJson)
        this.$emit('done')
      } 
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-form'] = this.$load('form/KForm')
  }
}
</script>
