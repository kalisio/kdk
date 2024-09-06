<template>
  <div>
    <q-separator />
    <!--
      Header section
     -->
    <div v-if="!hideHeader" class="row full-width items-center no-wrap" style="min-height: 30px">
      <span class="text-grey-7 text-body-2 ellipsis">
        {{ title }}
      </span>
      <q-space />
      <KPanel
        v-if="actions"
        :content="actions"
        :context="context"
        class="no-wrap"
      />
    </div>
    <!--
      Content section
     -->
    <div v-bind:class="{ 'q-py-xs': dense, 'q-py-sm': !dense }">
      <slot />
    </div>
  </div>
</template>

<script setup>

// Props
defineProps({
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
})
</script>
