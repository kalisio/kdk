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
  <!-- View tree -->
  <q-tree v-if="viewTree.length" :nodes="viewTree" node-key="_id" label-key="label" children-key="views"
    v-model:expanded="expandedViews" tick-strategy="leaf" v-model:ticked="selectedViews" @update:ticked="onSelect">
    <template v-slot:default-header="prop">
      <div class="row items-center">
        <div :id="prop.node._id">{{ prop.node.label }}</div>
      </div>
    </template>
  </q-tree>
  <div v-else class="row">
    <KStamp
      icon="las la-exclamation-circle"
      icon-size="1.6rem"
      :text="$t('KSelectViewsField.EMPTY')"
      direction="horizontal"
      class="q-pt-lg"
    />
  </div>
</template>

<script>
import _ from 'lodash'
import { Store, mixins as kCoreMixins } from '../../../../core/client'
import { useCatalog } from '../../composables'

export default {
  name: 'k-select-views-field',
  mixins: [kCoreMixins.baseField],
  data () {
    return {
      selectedViews: [],
      expandedViews: []
    }
  },
  inheritAttrs: false,
  computed: {
    clearable () {
      return _.get(this.properties.field, 'clearable', false)
    },
    viewTree () {
      const tree = []
      if (this.views.length > 0) {
        tree.push({ _id: 'views', label: this.$t('VIEWS_LABEL'), views: this.views.concat(this.contextViews) })
      }
      return tree
    }
  },
  watch: {
    viewTree (tree) {
      this.expandedViews = []
      if (_.find(tree, { _id: 'views' })) {
        this.expandedViews.push('views')
      }
    }
  },
  methods: {
    emptyModel () {
      return []
    },
    fill (value) {
      kCoreMixins.baseField.methods.fill.call(this, value)
      this.selectedViews = _.map(this.model, '_id')
    },
    onSelect () {
      // Keep only track of IDs
      // For views we rely on id as a "stable" identifier because the underlying view might be renamed
      this.model = this.selectedViews.map(viewId => ({ _id: viewId }))
      this.onChanged()
    }
  },
  mounted () {
    this.getViews()
    if (Store.get('context')) {
      this.getContextViews()
    }
  },
  setup (props) {
    // Use global catalog
    const { views, getViews } = useCatalog({ context: 'global' })
    // Use local catalog
    const { views: contextViews, getViews: getContextViews } = useCatalog({ context: Store.get('context') })

    // Expose
    return {
      views,
      getViews,
      contextViews,
      getContextViews
    }
  }
}
</script>
