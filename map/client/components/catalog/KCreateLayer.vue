<template>
  <div>
    <!-- Forms section -->
    <k-form ref="propertiesForm" :schema="getPropertiesFormSchema()" @field-changed="onPropertiesFormFieldChanged" />
    <k-form ref="featureIdForm" :key="featureIdFormKey" :schema="getFeatureIdFormSchema()" />
    <!-- Buttons section -->
    <q-card-actions align="right">
      <k-panel
        id="modal-buttons"
        :content="getButtons()"
        renderer="form-button"
        v-bind:class="{ 'q-gutter-x-md' : $q.screen.gt.xs, 'q-gutter-x-sm': $q.screen.lt.sm }" />
    </q-card-actions>
  </div>
</template>

<script>
import _ from 'lodash'
import { KAction, KPanel } from '../../../../core/client/components/frame'
import KForm from '../../../../core/client/components/form/KForm.vue'

export default {
  name: 'k-create-layer',
  components: {
    KAction,
    KPanel,
    KForm
  },
  emits: [
    'done'
  ],
  inject: ['kActivity'],
  data () {
    return {
      schema: null,
      featureIdFormKey: 1,
      creating: false
    }
  },
  methods: {
    getButtons () {
      return [{
        id: 'close-action',
        outline: true,
        label: 'CLOSE',
        renderer: 'form-button',
        handler: this.onClose
      }, {
        id: 'create-layer-action',
        label: this.$t('KCreateLayer.CREATE_BUTTON'),
        loading: this.creating,
        renderer: 'form-button',
        handler: this.onCreate
      }]
    },
    getPropertiesFormSchema () {
      return {
        $schema: 'http://json-schema.org/draft-06/schema#',
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
    },
    getFeatureIdFormSchema () {
      return {
        $schema: 'http://json-schema.org/draft-06/schema#',
        $id: 'http://kalisio.xyz/schemas/create-layer-set-feature-id#',
        type: 'object',
        properties: {
          featureId: {
            type: 'string',
            default: this.guessFeatureId(),
            field: {
              component: 'form/KSelectField',
              label: 'KCreateLayer.FEATURE_ID_FIELD_LABEL',
              options: this.getProperties()
            }
          }
        },
        required: []
      }
    },
    onPropertiesFormFieldChanged (field, value) {
      if (field === 'schema') {
        this.schema = value
        this.featureIdFormKey += 1
      }
    },
    getProperties () {
      if (this.schema) {
        const properties = _.keys(_.get(this.schema, 'content.properties', {}))
        return _.map(properties, prop => { return { label: prop, value: prop } })
      }
      return []
    },
    guessFeatureId () {
      if (this.schema) {
        const properties = _.keys(_.get(this.schema, 'content.properties', {}))
        for (const prop of properties) {
          if (prop.toLowerCase().includes('id', 'fid', 'featureid', '_id', 'objectid')) return prop
        }
      }
      return ''
    },
    onClose () {
      this.$emit('done')
    },
    async onCreate () {
      const propertiesResult = this.$refs.propertiesForm.validate()
      const featureIdResult = this.$refs.featureIdForm.validate()
      if (!propertiesResult.isValid || !featureIdResult.isValid) return
      this.creating = true
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
      if (this.schema) {
        Object.assign(newLayer, {
          schema: {
            name: this.schema.name,
            content: this.schema.content
          }
        })
      }
      // Create the layer
      await this.kActivity.addLayer(newLayer)
      // Start editing
      await this.kActivity.onEditLayerData(newLayer)
      this.creating = false
      this.$emit('done')
    }
  }
}
</script>
