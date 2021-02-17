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
        <k-menu id="item-actions" :content="computedActions" :context="$props" action-renderer="item" />
      </q-item-section>
    </slot>
  </q-item>
</template>

<script>
import mixins from '../../mixins'

export default {
  name: 'k-item',
  mixins: [mixins.baseItem()],
  props: {
    itemActions: {
      type: [Object, Array],
      default: () => { return null }
    }
  },
  computed: {
    computedActions () {
      // Actions can be provided externally if the card is reused to create a custom item
      // Otherwise use actions directly set on the item
      return this.itemActions || this.actions
    }
  },
  created () {
    // Loads the required components
    this.$options.components['k-menu'] = this.$load('frame/KMenu')
  }
}
</script>

<style>
.selected {
  font-weight: bold;
}
</style>
