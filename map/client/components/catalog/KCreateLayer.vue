<template>
  <div>
   <k-form ref="propertiesForm" :schema="getPropertiesFormSchema()" @field-changed="onPropertiesFormFieldChanged" />
    <k-form ref="featureIdForm" :key="featureIdFormKey" :schema="getFeatureIdFormSchema()" />
    <div class="row justify-end">
      <k-action 
        id="connect-action" 
        :label="$t('KCreateLayer.CREATE_BUTTON')" 
        renderer="form-button" 
        @triggered="onCreate" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'k-create-layer',
  inject: ['kActivity'],
  data () {
    return {
      schema: null,
      featureIdFormKey: 1
    }
  },
  methods: {
    getPropertiesFormSchema () {
      return {
        $schema: 'http://json-schema.org/draft-06/schema#',
        $id: 'http://kalisio.xyz/schemas/create-layer-set-properties#',
        type: 'object',
        properties: {
          name: {
            type: 'string',
            maxLength: 128,
            minLength: 3,          
            field: { 
              component: 'form/KTextField',
              label: 'KConnectLayer.NAME_FIELD_LABEL'
            }
          },
          description: {
            type: 'string',
            field: { 
              component: 'form/KTextField',
              label: 'KConnectLayer.DESCRIPTION_FIELD_LABEL'
            }
          },
          schema: { 
            type: 'object',
            field: {
              component: 'form/KFileField',
              label: 'schemas.CATALOG_SCHEMA_FIELD_LABEL',
              mimeTypes: 'application/json'
            }
          }
        },
        required: ['name', "schema"]
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
              label: 'KConnectLayer.FEATURE_ID_FIELD_LABEL',
              options: this.getProperties()
            }
          }
        },
        required: ['featureId']
      }
    },
    onPropertiesFormFieldChanged (field, value) {
      if (field === 'schema') {
        this.schema = value ? value.content : null
        this.featureIdFormKey+=1
      }
    },
    getProperties () {
      if (this.schema) {
        const properties = _.keys(_.get(this.schema, 'properties', {}))
        return _.map(properties, prop => { return { label: prop, value: prop } })
      }
      return []
    },
    guessFeatureId () {
      if (this.schema) {
        const properties = _.keys(_.get(this.schema, 'properties', {}))
        for (const prop of properties) {
          if (prop.toLowerCase().includes('id', 'fid', 'featureid', '_id', 'objectid')) return prop
        }
      }
      return ''
    },
    async onCreate () {
      const propertiesResult = this.$refs.propertiesForm.validate()
      const featureIdResult = this.$refs.featureIdForm.validate()
      if (!propertiesResult.isValid || !featureIdResult.isValid)  return
      // Create an empty layer
      const newLayer = {
        name: propertiesResult.values.name,
        description: propertiesResult.values.description,
        type: 'OverlayLayer',
        icon: 'insert_drive_file',
        featureId: featureIdResult.values.featureId,
        [this.kActivity.engine]: {
          type: 'geoJson',
          isVisible: true,
          realtime: true
        },
        schema: this.schema
      }
      // Create an empty layer used as a container
      await this.kActivity.addLayer(newLayer)
      // Start editing
      await this.kActivity.onEditLayerData(newLayer)
      this.$emit('done')
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-form'] = this.$load('form/KForm')
    this.$options.components['k-action'] = this.$load('frame/KAction')
  }
}
</script>
