<template>
  <q-item active-class="selected" class="cursor-pointer">
    <!--
      Avatar section
    -->
    <q-item-section top avatar @click="onItemSelected('avatar')">
      <slot name="item-avatar">
        <k-avatar :object="item" :contextId="contextId" />
      </slot>
    </q-item-section>
    <!--
      Content section
    -->
    <slot name="item-content">
      <q-item-section @click="onItemSelected('content')">
        <q-item-label>{{ name }}</q-item-label>
        <q-item-label caption lines="2">{{ description }}</q-item-label>
      </q-item-section>
    </slot>
    <!--
      Actions section
    -->
    <slot name="item-actions">
      <q-item-section side>
        <k-panel id="item-actions" :content="itemActions" :context="$props" />
      </q-item-section>
    </slot>
  </q-item>
</template>

<script>
import mixins from '../../mixins'

export default {
  name: 'k-item',
  mixins: [mixins.baseItem],
  created () {
    // Loads the required components
    this.$options.components['k-avatar'] = this.$load('frame/KAvatar')    
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
  }
}
</script>

<style>
.selected {
  font-weight: bold;
}
</style>
