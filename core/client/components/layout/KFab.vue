<template>
  <div v-if="actions" id="fab-container">
    <!--
      Render an expandable fab if more than one action is provided
     -->
    <q-fab v-if="actions.length > 1"
      id="fab"
      v-model="isOpened"
      :icon="icon"
      :padding="padding"
      vertical-actions-align="center"
      :direction="direction"
      :color="color"
      persistent
      class="k-fab"
    >
      <!-- Render a grid menu if the number of actions is higher than the expandable limit -->
      <q-menu v-if="actions.length > expandableLimit" v-model="isOpened" ref="menu" persistent fit anchor="top left" self="bottom right">
        <div class="q-pa-sm row" style="max-width: 50vw">
          <template v-for="action in actions" :key="action.id">
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
              <KAction
                :color="color"
                v-bind="action"
                renderer="item"
                v-on="action.on ? { [action.on.event]: action.on.listener } : {}"
                @triggered="isOpened = false"
              />
            </div>
          </template>
        </div>
      </q-menu>
      <!-- Render an expandable list of actions -->
      <div v-else>
        <template v-for="action in actions" :key="action.id">
          <KAction
            :color="color"
            v-bind="action"
            renderer="fab-action"
            :iconRight="alignment === 'left' ? true : false"
            v-on="action.on ? { [action.on.event]: action.on.listener } : {}"
          />
        </template>
      </div>
    </q-fab>
    <!--
      Render a non expandable fab if a single action is provided
     -->
    <KAction v-else-if="actions.length === 1"
      :color="color"
      v-bind="actions[0]"
      :size="size"
      renderer="fab"
      v-on="actions[0].on ? { [actions[0].on.event]: actions[0].on.listener } : {}"
    />
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed } from 'vue'
import KAction from '../action/KAction.vue'

// Props
const props = defineProps({
  content:{
    type: Array,
    default: () => null
  },
  icon: {
    type: String,
    default: 'las la-ellipsis-v'
  },
  color: {
    type: String,
    default: 'primary'
  },
  padding: {
    type: String,
    default: 'md'
  },
  direction: {
    type: String,
    required: true,
    validator: (value) => {
      return ['up', 'down'].includes(value)
    }
  },
  alignment: {
    type: String,
    required: true,
    validator: (value) => {
      return ['left', 'right'].includes(value)
    }
  },
  expandableLimit: {
    type: Number,
    default: 8
  }
})

// Data
//const fab = Layout.getFab()
const isOpened = ref(false)

// Computed
const actions = computed(() => {
  const actions = []
  // Apply filtering
  _.forEach(props.content, (action) => {
    let isVisible = _.get(action, 'visible', true)
    // Can be a functional call
    if (typeof isVisible === 'function') {
      isVisible = isVisible()
    }
    if (isVisible) actions.push(action)
  })
  return actions
})
</script>

<style lang="scss" scoped>
.k-fab {
  border: 1px solid var(--q-secondary);
}
</style>
