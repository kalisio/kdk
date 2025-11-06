<template>
  <q-field
      :for="properties.name + '-field'"
      :id="properties.name + '-field'"
      :label="label"
      v-model="model"
      :error-message="errorLabel"
      :error="hasError"
      :disable="disabled"
      :clearable="isClearable()"
      hide-bottom-space
      bottom-slots
      borderless
      @clear="clear">
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
  </q-field>
  <!-- Layer tree -->
  <q-tree :nodes="layerTree" node-key="id" label-key="label" children-key="layers"
    v-model:expanded="expandedLayers" tick-strategy="leaf" v-model:ticked="selectedLayers" @update:ticked="onSelect">
    <template v-slot:default-header="prop">
      <div class="row items-center">
        <div :id="prop.node.id">{{ prop.node.label }}</div>
      </div>
    </template>
  </q-tree>
</template>

<script>
import _ from 'lodash'
import { Context, mixins as kCoreMixins } from '../../../../core/client'
import { useCatalog } from '../../composables'

export default {
  name: 'k-select-layers-field',
  mixins: [kCoreMixins.baseField],
  data () {
    return {
      selectedLayers: [],
      expandedLayers: []
    }
  },
  inheritAttrs: false,
  computed: {
    layerTree () {
      const tree = []
      const userLayers = { id: 'userLayers', label: this.$t('LAYERS_LABEL'), layers: [] }
      const catalogLayers = { id: 'catalogLayers', label: this.$t('CATALOG_LABEL'), layers: [] }
      this.categories.concat(this.contextCategories).forEach(category => {
        let layers = this.contextLayersByCategory[category.name] || this.layersByCategory[category.name]
        // Nothing to select ?
        if (layers.length === 0) return
        // Built-in categories can't contain user-defined layers
        const rootNode = (category._id ? userLayers : catalogLayers)
        // Keep only what is required for rendering: id/label
        layers = layers.map(layer => Object.assign(_.pick(layer, ['_id', 'name', 'label']), { id: category._id ? layer._id : layer.name }))
        rootNode.layers.push({ id: category._id || category.name, label: category.label, layers })
      })
      // Add orphan layers if any
      this.orphanLayers.concat(this.orphanContextLayers).forEach(layer => {
        const rootNode = (layer.scope === 'user' ? userLayers : catalogLayers)
        // Push it front to be coherent with layers panel
        rootNode.layers.unshift(Object.assign(_.pick(layer, ['_id', 'name', 'label']), { id: layer.scope === 'user' ? layer._id : layer.name }))
      })

      if (userLayers.layers.length > 0) {
        tree.push(userLayers)
      }
      if (catalogLayers.layers.length > 0) {
        tree.push(catalogLayers)
      }
      return tree
    }
  },
  watch: {
    layerTree (tree) {
      this.expandedLayers = []
      if (_.find(tree, { id: 'userLayers' })) {
        this.expandedLayers.push('userLayers')
      }
      if (_.find(tree, { id: 'catalogLayers' })) {
        this.expandedLayers.push('catalogLayers')
      }
    }
  },
  methods: {
    emptyModel () {
      return []
    },
    isClearable () {
      return _.get(this.properties.field, 'clearable', false)
    },
    fill (value) {
      kCoreMixins.baseField.methods.fill.call(this, value)
      // As we keep track of ID/name depending on if a layer comes from local/global catalog we need to process both
      this.selectedLayers = _.map(_.filter(this.model, '_id'), '_id')
      this.selectedLayers = this.selectedLayers.concat(_.map(_.filter(this.model, 'name'), 'name'))
    },
    onSelect () {
      const layers = this.layers.concat(this.contextLayers)
      // Keep only track of IDs/names, take care that layers come from global/local catalog
      this.model = this.selectedLayers.map(id => {
        // For user layers we rely on id as a "stable" identifier because the underlying layer might be renamed
        const userLayer = _.find(layers, { _id: id })
        // For global catalog we rely on name as a "stable" identifier because the underlying layer might be recreated
        return (userLayer ? { _id: id } : { name: id })
      })
      this.onChanged()
    }
  },
  mounted () {
    this.getLayers()
    this.getCategories()
    if (Context.get()) {
      this.getContextLayers()
      this.getContextCategories()
    }
  },
  setup (props) {
    // Use global catalog
    const { layers, getLayers, categories, getCategories, layersByCategory, orphanLayers } =
      useCatalog({ context: 'global' })
    // Use local catalog if any
    const {
      layers: contextLayers, getLayers: getContextLayers, categories: contextCategories, getCategories: getContextCategories,
      layersByCategory: contextLayersByCategory, orphanLayers: orphanContextLayers
    } =
      useCatalog({ context: Context.get() })

    // Expose
    return {
      layersByCategory,
      orphanLayers,
      layers,
      getLayers,
      categories,
      getCategories,
      contextLayersByCategory,
      orphanContextLayers,
      contextLayers,
      getContextLayers,
      contextCategories,
      getContextCategories
    }
  }
}
</script>
