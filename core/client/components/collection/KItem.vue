<template>
  <q-item active-class="selected">
    <!--
      Toggle section
    -->
    <q-item-section v-if="options.toggle" side top>
      <slot name="item-toggle">
        <q-checkbox v-model="toggled" @input="onItemToggled(toggled)"/>
      </slot>
    </q-item-section>
    <!--
      Avatar section
    -->
    <q-item-section top avatar @click="onItemSelected('avatar')">
      <slot name="item-avatar">
        <k-avatar :object="item" :contextId="contextId" :options="options" />
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
import { QCheckbox } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-item',
  components: {
    QCheckbox
  },
  mixins: [mixins.baseItem],
  data () {
    return {
      toggled: false
    }
  },
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
