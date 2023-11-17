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
  <q-tree :nodes="viewTree" node-key="_id" label-key="label" children-key="views"
    tick-strategy="leaf" v-model:ticked="selectedViews" @update:ticked="onSelect">
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
      selectedViews: []
    }
  },
  computed: {
    clearable () {
      return _.get(this.properties.field, 'clearable', false)
    },
    viewTree () {
      return [{ _id: 'root', label: this.$t('VIEWS_LABEL'), views: this.views.concat(this.contextViews) }]
    }
  },
  methods: {
    emptyModel () {
      return []
    },
    onSelect () {
      // Keep only track of IDs
      this.model = this.selectedViews.map(viewId => { _id: viewId })
    }
  },
  mounted () {
    this.getViews()
  },
  setup (props) {
    // Use global catalog
    const { views: views, getViews: getViews } = useCatalog(api, { context: '' })
    // Use local catalog if any
    const { views: contextViews, getViews: getContextViews } = useCatalog(api, { context: props.contextId })

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
