<template>
  <div 
    v-bind:class="{
      'q-pl-xs q-pr-xs': !$q.screen.gt.xs,
      'q-pl-sm q-pr-sm': $q.screen.gt.xs,
      'column content-center': direction === 'vertical',
      'row items-center no-wrap': direction === 'horizontal'
    }">
      <div style="text-align: center">
        <q-icon :size="iconSize" :name="icon" />
        <q-tooltip v-if="!showText">
          {{ $t(text) }}
        </q-tooltip>
      </div>
      <div v-if="showText" class="q-pl-sm q-pr-sm">
         {{ $t(text) }}
      </div>
  </div>
</template>

<script>
export default {
  name: 'k-stamp',
  props: {
    icon: {
      type: String,
      required: ''
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
    showText () {
      return this.direction === 'vertical' || this.$q.screen.gt.xs
    }
  }
}
</script>
