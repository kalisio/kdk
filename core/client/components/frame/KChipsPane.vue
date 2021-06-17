<template>
  <div class="row justify-start items-center q-gutter-x-sm">
    <template v-for="chip in chips">
      <q-chip
        :key="getValue(chip)"
        :color="getColor(chip)"
        text-color="white"
        dense
        outline
        square>
        <q-icon v-if="hasIcon(chip)" :name="getIcon(chip)" class="q-mr-xs" />
        {{ getValue(chip) }}
      </q-chip>
    </template>
  </div>
</template>

<script>
import _ from 'lodash'
import { getIconName } from '../../utils'

export default {
  name: 'k-chips-pane',
  props: {
    chips: {
      type: Array,
      required: true
    }
  },
  methods: {
    getValue (chip) {
      return _.get(chip, 'value', chip)
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
    }
  }
}
</script>
