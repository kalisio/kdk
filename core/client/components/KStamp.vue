<template>
  <div
    v-bind:class="{
      'q-pl-xs q-pr-xs': $q.screen.lt.sm,
      'q-pl-sm q-pr-sm': $q.screen.gt.xs,
      'column items-center q-gutter-y-sm': direction === 'vertical',
      'row items-center no-wrap q-gutter-x-sm': direction === 'horizontal'
    }">
      <div v-if="canShowIcon">
        <q-icon :size="iconSize" :name="icon" />
      </div>
      <div class="ellipsis" :style="`font-size: ${textSize};`"
        v-bind:class="{'text-center': direction === 'vertical' }"
      >
         {{ $tie(text) }}
      </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'
import { useQuasar } from 'quasar'

// props
const props = defineProps({
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
    default: '0.875rem'
  },
  direction: {
    type: String,
    default: 'vertical',
    validator: (value) => {
      return ['horizontal', 'vertical'].includes(value)
    }
  }
})

// data
const $q = useQuasar()

// computed
const canShowIcon = computed(() => {
  return !_.isEmpty(props.icon)
})
</script>
