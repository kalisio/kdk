<template>
  <div
    v-bind:class="{
      'q-pl-xs q-pr-xs': !$q.screen.gt.xs,
      'q-pl-sm q-pr-sm': $q.screen.gt.xs,
      'column content-center': direction === 'vertical',
      'row items-center no-wrap': direction === 'horizontal'
    }">
      <div style="text-align: center">
        <q-icon v-if="showIcon" :size="iconSize" :name="icon" />
          <q-tooltip v-if="!showText">
            {{ translatedText }}
          </q-tooltip>
      </div>
      <div v-if="showText" class="q-pl-xs q-pr-xs ellipsis-2-lines" :style="`font-size: ${textSize}`">
         {{ translatedText }}
      </div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  name: 'k-stamp',
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
      return this.$i18n.i18next.exists(this.text) ? this.$t(this.text) : this.text
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
