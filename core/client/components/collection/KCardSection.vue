<template>
  <div v-if="hasSlot">
    <q-separator />
    <div v-if="expandable">
      <!-- Header section -->
      <q-expansion-item
        :icon="icon"
        :label="title"
        :dense="dense"
        @show="$emit('section-opened')"
        @hide="$emit('section-closed')">
        <!-- Content section -->
        <div v-bind:class="{ 'q-py-xs': dense, 'q-py-sm': !dense }">
          <slot />
        </div>
      </q-expansion-item>
    </div>
    <div v-else>
      <!-- Header section -->
      <div v-if="!dense">
        <div class="row full-width items-center">
          <q-icon v-if="icon" :name="icon" color="grey-7" size="xs" />
          <span class="text-grey-7 text-caption">{{ title }}</span>
          <q-space />
          <k-panel v-if="actions" :content="actions" :context="context" />
        </div>
        <!-- Content section -->
        <div class="q-py-sm">
          <slot />
        </div>
      </div>
      <div v-else class="q-py-xs">
        <slot />
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { KPanel } from '../frame'

export default {
  name: 'k-card-section',
  components: {
    KPanel
  },
  props: {
    icon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    actions: {
      type: Array,
      default: () => null
    },
    expandable: {
      type: Boolean,
      default: false
    },
    dense: {
      type: Boolean,
      default: false
    },
    context: {
      type: Object,
      default: () => null
    }
  },
  computed: {
    hasSlot () {
      return _.has(this.$slots, 'default')
    }
  }
}
</script>