<template>
  <div>
    <q-separator />
    <!--
      Header section
     -->
    <div v-if="!hideHeader" class="row full-width items-center">
      <span class="text-grey-7 text-caption">{{ title }}</span>
      <q-space />
      <k-panel v-if="actions" :content="actions" :context="context" />
    </div>
    <!--
      Content section
     -->
    <div v-bind:class="{ 'q-py-xs': dense, 'q-py-sm': !dense }">
      <slot />
    </div>
  </div>
</template>

<script>
import { KPanel } from '../.'

export default {
  components: {
    KPanel
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    actions: {
      type: Array,
      default: () => null
    },
    hideHeader: {
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
  }
}
</script>
