<template>
  <q-select
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    ref="select"
    v-model="layer"
    :label="label"
    fill-input
    autocomplete="off"
    hide-selected
    use-input
    :error-message="errorLabel"
    :error="hasError"
    bottom-slots
    :options="filteredLayers"
    option-label="display"
    option-value="id"
    :loading="loading"
    @filter="onFilter"
    @update:model-value="onUpdated">
    <!-- Options display -->
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        :id="getId(scope.opt)"
      >
        <q-item-section>
          <q-item-label>{{ scope.opt.display }} [{{ scope.opt.id }}]</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <!-- Helper -->
    <template v-if="hasHelper" v-slot:append>
      <k-action
        :id="properties.name + '-helper'"
        :label="helperLabel"
        :icon="helperIcon"
        :tooltip="helperTooltip"
        :url="helperUrl"
        :dialog="helperDialog"
        :context="helperContext"
        @dialog-confirmed="onHelperDialogConfirmed"
        color="primary"
      />
    </template>
  </q-select>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins } from '../../../../core/client'
import * as wfs from '../../../common/wfs-utils'

export default {
  name: 'k-ows-layer-field',
  mixins: [kCoreMixins.baseField],
  data () {
    return {
      layer: null,
      loading: false,
      filter: ''
    }
  },
  computed: {
    filteredLayers () {
      return this.filter
        ? this.availableLayers.filter(layer => layer.display.toLowerCase().includes(this.filter.toLowerCase()))
        : this.availableLayers
    },
    availableLayers () {
      // sort alphabetically layers per display
      return this.service
        ? _.map(this.service.availableLayers, (value, key) => value).sort((a, b) => {
          const uppera = a.display.toUpperCase()
          const upperb = b.display.toUpperCase()
          return uppera < upperb ? -1 : uppera > upperb ? 1 : 0
        })
        : []
    }
  },
  methods: {
    getId (layer) {
      return _.kebabCase(layer.id)
    },
    emptyModel () {
      return null
    },
    onFilter (val, update, abort) {
      update(() => {
        this.filter = val.toLocaleLowerCase()
      })
    },
    async onUpdated (layer) {
      this.error = ''
      this.loading = true
      const newModel = Object.assign({}, layer)
      if (layer) {
        if (this.service.protocol === 'WFS') {
          try {
            const desc = await wfs.DescribeFeatureType(this.service.baseUrl, this.service.version, layer.id, this.service.searchParams)
            newModel.schema = wfs.generatePropertiesSchema(desc, layer.display)
            const decodedDesc = wfs.decodeFeatureType(desc)
            newModel.properties = decodedDesc.properties.map(prop => prop.name)
          } catch (error) {
            this.error = 'KOwsLayerField.UNABLE_TO_DESCRIBE_FEATURE_TYPE'
          }
        } else if (this.service.protocol === 'WMTS') {
          // picked layer must be available with 3857 crs
          if (!_.has(layer.crs, '3857')) {
            this.error = 'KOwsLayerField.UNSUPPORTED_LAYER_CRS'
          }
          // selected layer must support at least one image format we understand
          // some WMTS layer only expose application/x-protobuf as format
          const supportedFormats = _.map(layer.formats, (value, key) => key)
          const hasImageFormat = supportedFormats.some((format) => format.startsWith('image/'))
          if (!hasImageFormat) {
            this.error = 'KOwsLayerField.UNSUPPORTED_LAYER_FORMAT'
          }
        } else if (this.service.protocol === 'TMS') {
          // selected layer must be available with 3857 crs
          if (layer.srs !== 'EPSG:3857') {
            this.error = 'KOwsLayerField.UNSUPPORTED_LAYER_CRS'
          }
        }
      }
      this.loading = false
      if (!this.error) {
        this.model = newModel
        this.onChanged()
      } else {
        layer = null
      }
    }
  },
  created () {
    // Build the list of available layers
    this.service = _.get(this.properties, 'field.service', null)
  }
}
</script>
