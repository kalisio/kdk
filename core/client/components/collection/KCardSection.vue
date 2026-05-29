<template>
  <div>
    <q-separator v-if="!hideSeparator" />
    <div
      v-hover="{ enter: onEnter, leave: onLeave }"
      class="q-py-xs q-px-sm"
      :class="{ 'k-hovered-card-section': hoverable }"
    >
        <!--
          Header section
        -->
      <div v-if="!hideHeader" class="row full-width justify-between items-center no-wrap">
        <span class="text-grey-7 text-body-2 ellipsis">
          {{ title }}
        </span>
        <KPanel
          v-if="isHovered && filteredActions?.length"
          :content="filteredActions"
          :context="context"
          class="q-pa-xs q-gutter-x-xs no-wrap"
          :class="{ 'k-hovered-toolbar': hoverable }"
        />
      </div>
      <!--
        Content section
      -->
      <div :class="{ 'q-py-xs': dense, 'q-py-sm': !dense }">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed } from 'vue'
import { CardSectionProps } from '../../utils/utils.items.js'

// Props
const props = defineProps(_.omit(CardSectionProps, ['item']))

// Data
const isHovered = ref(!props.hoverable)

// Computed
const filteredActions = computed(() => {
  if (!props.actionsFilter) return props.actions
  let filter = props.actionsFilter
  if (_.isString(filter)) filter = [filter]
  return _.filter(props.actions, action => {
    return _.indexOf(filter, action.id) >= 0
  })
})

// Functions
function onEnter () {
  if (props.hoverable) isHovered.value = true
}
function onLeave () {
  if (props.hoverable) isHovered.value = false
}
</script>

<style lang="scss" scoped>
.k-hovered-card-section {
  position: relative;
}
.k-hovered-card-section:hover {
  background-color: #eeeeee;
  border-radius: 8px;
}
.k-hovered-toolbar {
  position: absolute;
  top: -24px;
  right: -12px;
  background-color: white;
  border-radius: 20px;
  border: 1px solid lightgrey;
  z-index: 990;
}
</style>