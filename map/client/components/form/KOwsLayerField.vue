<template>
  <q-select
    ref="select"
    v-model="layer"
    :label="label"
    fill-input
    hide-selected
    use-input
    :error-message="errorLabel"
    :error="hasError"
    bottom-slots
    :options="availableLayers"
    option-label="display"
    option-value="id"
    :loading="loading"
    @input="onUpdated">
    <!-- Helper -->
    <template v-if="helper" v-slot:hint>
      <span v-html="helper" />
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
      layer: '',
      loading: false
    }
  },
  computed: {
    availableLayers () {
      return this.service ? _.map(this.service.availableLayers, (value, key) => value) : []
    }
  },
  methods: {
    emptyModel () {
      return null
    },
    async onUpdated (layer) {
      this.error = ''
      this.loading = true
      if (layer) {
        if (this.service.protocol === 'WFS') {
          try {
            const desc = await wfs.DescribeFeatureType(this.service.baseUrl, this.service.version, layer.id, this.service.searchParams)
            console.log(desc)
            layer.schema = wfs.generatePropertiesSchema(desc, layer.display)
            const decodedDesc = wfs.decodeFeatureType(desc)
            layer.properties = decodedDesc.properties.map(prop => prop.name)
          } catch (error) {
            this.error = 'KOwsLayerField.UNABLE_TO_DESCRIBE_FEATURE_TYPE'
            layer = null
          }
        }
      }
      this.model = layer
      this.loading = false
      this.onChanged()
    }
  },
  created () {
    // Build the list of available layers
    this.service = _.get(this.properties, 'field.service', null)
  }
}
</script>
