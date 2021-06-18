<template>
  <div>
    <q-separator />
    <!-- Header section -->
    <div v-if="expandable">
      <q-expansion-item
        :icon="icon"
        :label="title"
        @show="$emit('section-opened')"
        @hide="$emit('section-closed')">
        <!-- Content section -->
        <div class="q-pl-sm q-pr-sm q-pb-sm">
          <slot  />
        </div>
      </q-expansion-item>
    </div>
    <div v-else>
      <q-item class="q-px-md">
        <q-item-section v-if="icon" avatar>
          <q-icon :name="icon" color="grey-7" szie="xs" />
        </q-item-section>
        <q-item-section class="text-grey-7 text-caption">{{ title }}</q-item-section>
        <q-item-section side>
          <k-panel v-if="actions" :content="actions" />
        </q-item-section>
      </q-item>
      <!-- Content section -->
      <div class="q-pl-sm q-pr-sm q-pb-sm">
        <slot  />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'k-card-section',
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
    }
  },
  created () {
    // Loads the required components
    this.$options.components['k-panel'] = this.$load('frame/KPanel') 
  }
}
</script>