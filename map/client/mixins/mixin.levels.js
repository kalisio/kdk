import _ from 'lodash'

export const levels = {
  emits: [
    'selected-level-changed'
  ],
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
        this.selectableLevels = {}
        this.selectableLevelsLayer = null
        this.setSelectedLevel(null)
      }
    },
    setSelectedLevel (level) {
      if (this.selectedLevel === level) return
      this.selectedLevel = level
      this.onSelectedLevelChanged(level)
    },
    onSelectedLevelChanged (level) {
      this.$emit('selected-level-changed', level)
      this.$engineEvents.emit('selected-level-changed', level)
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
    this.$engineEvents.on('layer-shown', this.onShowSelectableLevelsLayer)
    this.$engineEvents.on('layer-hidden', this.onHideSelectableLevelsLayer)
  },
  beforeUnmount () {
    this.$engineEvents.off('layer-shown', this.onShowSelectableLevelsLayer)
    this.$engineEvents.off('layer-hidden', this.onHideSelectableLevelsLayer)
  }
}
