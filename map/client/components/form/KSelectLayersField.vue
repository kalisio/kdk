<template>
  <q-field
      :for="properties.name + '-field'"
      :id="properties.name + '-field'"
      :label="label"
      v-model="model"
      :error-message="errorLabel"
      :error="hasError"
      :disable="disabled"
      :clearable="clearable"
      hide-bottom-space
      bottom-slots
      borderless
      @clear="clear">
      <!-- Helper -->
      <template v-if="helper" v-slot:hint>
        <span v-html="helper"></span>
      </template>
  </q-field>
  <!-- Layer tree -->
  <q-tree :nodes="layerTree" node-key="_id" label-key="label" children-key="layers"
    tick-strategy="leaf" v-model:ticked="selectedLayers" @update:ticked="onSelect">
  </q-tree>
</template>

<script>
import _ from 'lodash'
import { api, mixins as kCoreMixins } from '../../../../core/client'
import { useCatalog } from '../../composables'

export default {
  name: 'k-select-layers-field',
  mixins: [kCoreMixins.baseField],
  data () {
    return {
      selectedLayers: []
    }
  },
  computed: {
    clearable () {
      return _.get(this.properties.field, 'clearable', false)
    },
    layerTree () {
      const tree = { _id: 'root', label: this.$t('LAYERS_LABEL'), layers: [] }
      this.categories.concat(this.contextCategories).forEach(category => {
        const layers = this.contextLayersByCategory[category.name] || this.layersByCategory[category.name]
        tree.layers.push({ _id: category._id || category.name, label: category.label, layers: this.layersByCategory[category.name] })
      })
      return [tree]
    }
  },
  methods: {
    emptyModel () {
      return []
    },
    onSelect () {
      // Keep only track of IDs, take care that layers come from global/local catalog
      this.model = this.selectedLayers.map(layerId => {
        const layer = { _id: layerId }
        if (_.find(this.contextLayers, layer)) layer.context = props.contextId
        return layer
      })
    }
  },
  mounted () {
    this.getLayers()
    this.getCategories()
  },
  setup (props) {
    // Use global catalog
    const { layers: layers, getLayers: getLayers, categories: categories, getCategories: getCategories, layersByCategory: layersByCategory } =
      useCatalog(api, { context: '' })
    // Use local catalog if any
    const { layers: contextLayers, getLayers: getContextLayers, categories: contextCategories, getCategories: getContextCategories, layersByCategory: contextLayersByCategory } =
      useCatalog(api, { context: props.contextId })

    // Expose
    return {
      layersByCategory,
      layers,
      getLayers,
      categories,
      getCategories,
      contextLayersByCategory,
      contextLayers,
      getContextLayers,
      contextCategories,
      getContextCategories
    }
  }
}
</script>
