<template>
  <div class="row justify-start items-center q-gutter-sm">
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
      return _.get(chip, 'icon.color', 'grey-7')
    },
    hasIcon (chip) {
      return _.get(chip, 'icon')
    },
    getIcon (chip) {
      return getIconName(chip)
    }
  }
}
</script>
