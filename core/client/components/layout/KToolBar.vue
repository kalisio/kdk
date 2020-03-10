<template>
  <div class="row items-center no-wrap">
    <template v-for="action in actions">
      <q-separator v-if="action.name == 'separator'" :key="key(action)" vertical />
      <q-btn v-else
        :key="key(action)"
        :icon="action.icon"
        :color="action.warning ? 'warning' : color"
        flat
        round
        :dense="dense"
        @click="onActionTriggered(action)">
        <q-tooltip>
          {{action.warning ? action.warning : action.label}}
        </q-tooltip>
      </q-btn>
    </template>
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
      default: 'primary'
    },
    dense: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    key (action) {
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
