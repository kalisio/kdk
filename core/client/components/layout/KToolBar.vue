<template>
  <div class="row items-center no-wrap"
    v-bind:class="{
      'row items-center no-wrap': direction === 'horizontal',
      'column content-center no-wrap': direction === 'vertical'
    }"
  >
    <slot name="before" />
    <template v-for="action in actions">
      <q-separator v-if="action.name === 'separator'" :key="actionKey(action)" vertical />
      <q-btn v-else
        :id="action.name"
        :key="actionKey(action)"
        :icon="action.icon"
        :color="action.color ? action.color : color"
        :size="action.size ? action.size: size"
        flat
        round
        :dense="dense"
        @click="onActionTriggered(action)">
        <!-- tooltip -->
        <q-tooltip v-if="action.label">
          {{action.warning ? action.warning : action.label}}
        </q-tooltip>
        <!-- badge -->
        <q-badge v-if="action.badge" class="q-py-xs" v-bind="action.badge">
          <q-icon v-if="action.badge.icon" v-bind="action.badge.icon" />
        </q-badge>
      </q-btn>
    </template>
    <slot name="after" />
  </div>
</template>

<script>
import { uid } from 'quasar'

export default {
  name: 'k-tool-bar',
  props: {
    actions: {
      type: Array,
      default: () => { return [] }
    },
    context: {
      type: Object,
      default: () => { return null }
    },
    color: {
      type: String,
      default: 'grey-9'
    },
    size: {
      type: String,
      default: 'md'
    },
    dense: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: 'horizontal',
      validator: (value) => {
        return ['horizontal', 'vertical'].includes(value)
      }
    }
  },
  methods: {
    actionKey (action) {
      return action.name + '-' + uid()
    },
    onActionTriggered (action) {
      // If a handler is given call it
      if (action.handler) action.handler(this.context)
      // If a route is given activate it
      else if (action.route) this.$router.push(action.route)
    }
  }
}
</script>
