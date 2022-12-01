<template>
  <div
    v-bind:class="{
      'q-pl-xs q-pr-xs': $q.screen.lt.sm,
      'q-pl-sm q-pr-sm': $q.screen.gt.xs,
      'column items-center q-gutter-y-sm': direction === 'vertical',
      'row items-center no-wrap q-gutter-x-sm': direction === 'horizontal'
    }">
      <div>
        <q-icon v-if="canShowIcon" :size="iconSize" :name="icon" />
          <q-tooltip v-if="!canShowText">
            {{ $tie(text) }}
          </q-tooltip>
      </div>
      <div v-if="canShowText" class="ellipsis" :style="`font-size: ${textSize};`"
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
const canShowText = computed(() => {
  return props.direction === 'vertical' || _.isEmpty(props.icon) || $q.screen.gt.xs
})
</script>
