<template>
  <q-item class="cursor-pointer bg-white" active-class="selected">
    <!--
      Toggle section
    -->
    <q-item-section v-if="options.toggle" side top>
      <slot name="item-toggle">
        <q-checkbox v-model="toggled" @update:modelValue="onItemToggled(toggled)"/>
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
        <q-item-label caption lines="2">
          <span v-html="description" />
        </q-item-label>
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
import { KPanel, KAvatar } from '../frame'
import { baseItem } from '../../mixins'

export default {
  components: {
    KPanel,
    KAvatar
  },
  mixins: [baseItem],
  data () {
    return {
      toggled: false
    }
  }
}
</script>

<style lang="scss">
  .selected {
    font-weight: bold;
  }
</style>
