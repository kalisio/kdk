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
  <!-- View tree -->
  <q-tree v-if="viewTree.length" :nodes="viewTree" node-key="_id" label-key="label" children-key="views"
    tick-strategy="leaf" v-model:ticked="selectedViews" @update:ticked="onSelect">
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
import { api, Store, mixins as kCoreMixins } from '../../../../core/client'
import { useCatalog } from '../../composables'

export default {
  name: 'k-select-views-field',
  mixins: [kCoreMixins.baseField],
  data () {
    return {
      selectedViews: []
    }
  },
  computed: {
    clearable () {
      return _.get(this.properties.field, 'clearable', false)
    },
    viewTree () {
      const tree = []
      if (this.views.length > 0) tree.push({ _id: 'views', label: this.$t('VIEWS_LABEL'), views: this.views })
      if (this.contextViews.length > 0) tree.push({ _id: 'contextViews', label: this.$t('CATALOG'), views: this.contextViews })
      return tree
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
      this.model = this.selectedViews.map(viewId => { _id: viewId })
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
    const { views: views, getViews: getViews } = useCatalog(api, { context: '' })
    // Use local catalog if any
    const { views: contextViews, getViews: getContextViews } = useCatalog(api, { context: Store.get('context') })

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
