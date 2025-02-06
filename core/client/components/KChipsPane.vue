<template>
  <div class="row justify-start items-center q-gutter-x-sm">
    <template v-for="(chip,index) in chips">
      <q-chip
        v-if="getValue(chip)"
        :key="getValue(chip)"
        :color="getColor(chip)"
        text-color="white"
        :removable="removable"
        @remove="onRemove(chip)"
        :id="getID(chip)"
        dense
        outline
        square>
        <q-icon v-if="hasIcon(chip)" :name="getIcon(chip)" class="q-mr-xs" />
        <span :id="getValue(chip)" class="ellipsis">{{ getValue(chip) }}
          <q-tooltip v-if="tooltips[index]">
            {{ getValue(chip) }}
          </q-tooltip>
        </span>
      </q-chip>
    </template>
  </div>
</template>

<script>
import _ from 'lodash'
import KPanel from './KPanel.vue'
import { getIconName } from '../utils/index.js'

export default {
  components: {
    KPanel
  },
  props: {
    chips: {
      type: Array,
      required: true
    },
    valuePath: {
      type: [String, Array],
      default: 'value'
    },
    removable: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      tooltips: _.fill(Array(this.chips.length), false)
    }
  },
  methods: {
    getValue (chip) {
      if (typeof this.valuePath === 'string') return _.get(chip, this.valuePath, this.$t('UNAMED'))
      for (let i = 0; i < this.valuePath.length; i++) {
        const path = this.valuePath[i]
        if (_.has(chip, path)) return _.get(chip, path)
      }
      return this.$t('UNAMED')
    },
    getColor (chip) {
      const color = _.get(chip, 'icon.color')
      return _.isEmpty(color) ? 'black' : color
    },
    hasIcon (chip) {
      const icon = chip.icon
      if (!icon) return false
      if (typeof icon === 'object') return !_.isEmpty(icon.name)
      return true
    },
    getIcon (chip) {
      return getIconName(chip)
    },
    getID (chip) {
      return `${_.kebabCase(chip.value)}-pane`
    },
    onRemove (chip) {
      this.$emit('chip-removed', chip)
    }
  },
  mounted () {
    this.$nextTick(() => {
      for (let i = 0; i < this.chips.length; i++) {
        const chip = this.chips[i]
        const chipElement = document.getElementById(this.getValue(chip))
        if (chipElement && chipElement.offsetWidth < chipElement.scrollWidth) this.tooltips[i] = true
      }
    })
  }
}
</script>
