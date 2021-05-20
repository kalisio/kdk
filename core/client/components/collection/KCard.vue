<template>
  <q-card bordered @click="onItemSelected">
    <!--
      Header section
    -->
    <slot name="card-header">
      <k-panel v-if="header" class="q-pa-md" :content="header" :context="$props" />
    </slot>
    <!--
      Title section
    -->
    <slot name="card-title">
      <q-item class="q-pa-md">
        <q-item-section top avatar>
          <slot name="card-avatar">
            <k-avatar :object="item" :contextId="contextId" :options="options" />
          </slot>
        </q-item-section>
        <q-item-section>
          <slot name="card-label">
            <q-item-label class="text-subtitle1 text-weight-medium">
              <k-text-area :text="name" />
            </q-item-label>
            <q-item-label>
              <k-text-area :text="description" />
            </q-item-label>
          </slot>
        </q-item-section>
      </q-item>
    </slot>
    <!--
      Content section
    -->
    <slot name="card-content" />
    <!--
      Actions section
    -->
    <slot name="card-actions">
      <q-separator v-if="itemActions" />
      <q-card-actions class="q-pa-xs" align="right">
        <k-panel id="card-actions" :content="itemActions" :context="$props" />
      </q-card-actions>
    </slot>
  </q-card>
</template>

<script>
import mixins from '../../mixins'

export default {
  name: 'k-card',
  mixins: [mixins.baseItem],
  props: {
    header: {
      type: [Object, Array],
      default: () => null
    }
  },
  created () {
    // Loads the required components
    this.$options.components['k-panel'] = this.$load('frame/KPanel')    
    this.$options.components['k-avatar'] = this.$load('frame/KAvatar')
    this.$options.components['k-text-area'] = this.$load('frame/KTextArea')
  }
}
</script>
