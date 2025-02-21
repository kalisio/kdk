<template>
  <div>
    <!-- Forms section -->
    <k-form
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

<script>
import _ from 'lodash'
import path from 'path-browserify'
import { generatePropertiesSchema } from '../../utils'
import { KPanel } from '../../../../core/client/components'
import KForm from '../../../../core/client/components/form/KForm.vue'

export default {
  name: 'k-import-layer',
  components: {
    KPanel,
    KForm
  },
  emits: [
    'done'
  ],
  inject: ['kActivity'],
  data () {
    return {
      importing: false,
      filename: ''
    }
  },
  computed: {
    fileFormSchema () {
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
    },
    propertiesFormSchema () {
      return {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: 'http://kalisio.xyz/schemas/import-layer-set-properties#',
        type: 'object',
        properties: {
          name: {
            type: 'string',
            maxLength: 128,
            minLength: 2,
            default: this.filename,
            field: {
              component: 'form/KTextField',
              label: 'KImportLayer.NAME_FIELD_LABEL'
            }
          },
          description: {
            type: 'string',
            default: this.filename,
            field: {
              component: 'form/KTextField',
              label: 'KImportLayer.DESCRIPTION_FIELD_LABEL'
            }
          },
          featureId: {
            type: 'string',
            default: this.guessFeatureId(),
            field: {
              component: 'form/KSelectField',
              label: 'KImportLayer.FEATURE_ID_FIELD_LABEL',
              options: this.getProperties()
            }
          }
        },
        required: ['name']
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
        id: 'import-layer-action',
        label: this.$t('KImportLayer.IMPORT_BUTTON'),
        loading: this.importing,
        renderer: 'form-button',
        handler: this.onImport
      }]
    }
  },
  methods: {
    onFileFormFieldChanged (field, value) {
      this.file = value
      this.filename = path.basename(this.file.name, path.extname(this.file.name))
      if (value) {
        this.file.schema = generatePropertiesSchema(value.content, value.name)
      }
    },
    getProperties () {
      if (this.file) {
        const properties = _.keys(_.get(this.file, 'schema.properties', {}))
        return _.map(properties, prop => { return { label: prop, value: prop } })
      }
      return []
    },
    guessFeatureId () {
      if (this.file) {
        const properties = _.keys(_.get(this.file, 'schema.properties', {}))
        for (const prop of properties) {
          if (_.indexOf(['id', 'fid', 'featureid', '_id', 'objectid'], prop.toLowerCase()) >= 0) return prop
        }
      }
      return ''
    },
    onClose () {
      this.$emit('done')
    },
    async onImport () {
      const fileResult = this.$refs.fileForm.validate()
      const propertiesResult = this.$refs.propertiesForm.validate()
      if (!fileResult.isValid || !propertiesResult.isValid) return
      this.importing = true
      await this.kActivity.addGeoJsonLayer({
        name: propertiesResult.values.name,
        description: propertiesResult.values.description,
        schema: { name: this.file.name, content: this.file.schema },
        featureId: propertiesResult.values.featureId
      }, this.file.content)
      this.importing = false
      this.$emit('done')
    }
  },
  created () {
    // Set data
    this.file = null
  }
}
</script>
