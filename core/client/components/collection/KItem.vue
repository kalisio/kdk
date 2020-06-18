<template>
  <q-item active-class="selected" class="cursor-pointer">
    <!--
      Avatar section
    -->
    <q-item-section top avatar>
      <slot name="item-avatar">
        <q-avatar v-if="avatar.type === 'text'" color="primary" text-color="white" >{{ avatar.text }}</q-avatar>
        <q-avatar v-if="avatar.type === 'icon'" :color="avatar.icon.color" text-color="white" :icon="avatar.icon.name" />
      </slot>
    </q-item-section>
    <!--
      Content section
    -->
    <slot name="item-content">
      <q-item-section @click="onItemSelected">
        <slot name="item-label">
          <q-item-label>{{ name }}</q-item-label>
        </slot>
        <slot name="item-sublabel">
          <q-item-label caption>{{ description }}</q-item-label>
        </slot>
      </q-item-section>
    </slot>
    <!--
      Actions section
    -->
    <slot name="item-actions">
      <q-item-section side>
        <k-overflow-menu :actions="itemActions" :context="item" :dense="$q.screen.lt.md" />
      </q-item-section>
    </slot>
  </q-item>
</template>

<script>
import mixins from '../../mixins'

export default {
  name: 'k-item',
  mixins: [mixins.baseItem],
  props: {
    itemActions: {
      type: Array,
      default: () => { return [] }
    }
  },
  methods: {
    key (object, property) {
      return this.item._id + '-' + object[property]
    }
  },
  created () {
    // Loads the required components
    this.$options.components['k-overflow-menu'] = this.$load('layout/KOverflowMenu')
  }
}
</script>

<style>
.selected {
  font-weight: bold;
}
</style>
