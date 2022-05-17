<template>
  <div
    v-bind:class="{
      'q-pl-xs q-pr-xs': $q.screen.lt.sm,
      'q-pl-sm q-pr-sm': $q.screen.gt.xs,
      'column items-center q-gutter-y-sm': direction === 'vertical',
      'row items-center no-wrap q-gutter-x-sm': direction === 'horizontal'
    }">
      <div>
        <q-icon v-if="showIcon" :size="iconSize" :name="icon" />
          <q-tooltip v-if="!showText">
            {{ translatedText }}
          </q-tooltip>
      </div>
      <div v-if="showText" class="ellipsis-2-lines" :style="`font-size: ${textSize};`"
        v-bind:class="{'text-center': direction === 'vertical' }"
      >
         {{ translatedText }}
      </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  props: {
    icon: {
      type: String,
      default: undefined
    },
    iconSize: {
      type: String,
      default: '2rem'
    },
    text: {
      type: String,
      defatult: ''
    },
    textSize: {
      type: String,
      default: '1rem'
    },
    direction: {
      type: String,
      default: 'vertical',
      validator: (value) => {
        return ['horizontal', 'vertical'].includes(value)
      }
    }
  },
  computed: {
    translatedText () {
      return this.$te(this.text) ? this.$t(this.text) : this.text
    },
    showIcon () {
      return !_.isEmpty(this.icon)
    },
    showText () {
      return this.direction === 'vertical' || _.isEmpty(this.icon) || this.$q.screen.gt.xs
    }
  }
}
</script>
