<template>
  <div style="height: 30vh;">
    <div v-if="properties" class="fit">
      <q-scroll-area :thumb-style="thumbStyle" :bar-style="barStyle" class="fit">
        <div>
          <k-view ref="view" :schema="schema" :display="options" @view-ready="onViewReady" />
        </div>
      </q-scroll-area>
    </div>
    <div v-else class="absolute-center">
      <k-label :text="$t('KFeatureInfoBox.NO_DATA_AVAILABLE')" icon-size="48px" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { QScrollArea, colors } from 'quasar'
import { mixins } from '../../../../core/client'

export default {
  name: 'k-feature-info-box',
  components: {
    QScrollArea
  },
  mixins: [
    mixins.refsResolver(['view'])
  ],
  inject: ['kActivity'],
  data () {
    return {
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: colors.getBrand('secondary'),
        width: '5px',
        opacity: 0.75
      },
      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: colors.getBrand('primary'),
        width: '9px',
        opacity: 0.2
      },
      options: {
        labelWidth: 5,
        separators: true
      },
      schema: null,
      properties: null
    }
  },
  methods: {
    async onFeatureClicked (options, event) {
      this.properties = null
      if (!options || !options.schema) return
      this.schema = options.schema.content
      // We need to force a refresh so that the prop is correctly updated by Vuejs in child components
      await this.$nextTick()
      const feature = _.get(event, 'target.feature')
      const entity = _.get(event, 'target')
      const layer = _.get(event, 'target')
      if (!feature || !entity) return
      const properties = (this.kActivity.is2D()
        ? this.kActivity.generateLeafletStyle('infobox', feature, layer, options)
        : this.kActivity.generateCesiumStyle('infobox', entity, options))
      if (!_.isEmpty(properties)) {
        this.properties = properties
        // If already shown update values
        if (this.$refs.view) this.$refs.view.fill(this.properties)
      }
    },
    onClose () {
      this.properties = null
      this.schema = null
    },
    onViewReady () {
      this.$refs.view.fill(this.properties)
    }
  },
  created () {
    // laod the required components
    this.$options.components['k-view'] = this.$load('form/KView')
    this.$options.components['k-label'] = this.$load('frame/KLabel')
    // Listen to the click feature event
    this.kActivity.$on('click', this.onFeatureClicked)
  },
  beforeDestroy () {
    this.kActivity.$on('click', this.onFeatureClicked)
  }
}
</script>
