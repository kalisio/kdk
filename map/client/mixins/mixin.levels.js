import _ from 'lodash'

export default {
  data () {
    return {
      selectedLevel: null,
      selectableLevels: {},
      selectableLevelsLayer: null
    }
  },
  computed: {
    hasSelectableLevels () {
      return _.get(this.selectableLevels, 'values', []).length > 0
    }
  },
  methods: {
    setSelectableLevels (layer, levels, initialLevel) {
      this.selectableLevels = levels
      this.selectableLevelsLayer = layer
      if (_.isNil(initialLevel)) {
        initialLevel = _.get(levels, 'values[0]', _.get(levels, 'range.min'))
      }
      this.setSelectedLevel(initialLevel)
    },
    clearSelectableLevels (layer) {
      if (this.selectableLevelsLayer) {
        this.setSelectedLevel(null)
        this.selectableLevels = {}
        this.selectableLevelsLayer = null
      }
    },
    setSelectedLevel (level) {
      this.selectedLevel = level
      this.$emit('selected-level-changed', level)
    },
    onShowSelectableLevelsLayer (layer) {
      // Check for valid types
      const levels = _.get(layer, 'levels')
      if (levels) {
        this.setSelectableLevels(layer, levels)
      }
    },
    onHideSelectableLevelsLayer (layer) {
      // Check for valid types
      const levels = _.get(layer, 'levels')
      if (levels) {
        this.clearSelectableLevels(layer)
      }
    }
  },
  created () {
    this.$on('layer-shown', this.onShowSelectableLevelsLayer)
    this.$on('layer-hidden', this.onHideSelectableLevelsLayer)
  },
  beforeDestroy () {
    this.$off('layer-shown', this.onShowSelectableLevelsLayer)
    this.$off('layer-hidden', this.onHideSelectableLevelsLayer)
  }
}
