<template>
  <div>
    <q-card bordered @click="onItemSelected">
      <!--
        Header section
      -->
      <slot name="card-header" />
      <!--
        Title section
      -->
      <slot name="card-title">
        <q-item>
          <q-item-section top avatar>
            <slot name="card-avatar">
              <q-avatar v-if="avatar.type === 'text'" color="primary" text-color="white" >{{ avatar.text }}</q-avatar>
              <q-avatar v-if="avatar.type === 'icon'" :color="avatar.icon.color" text-color="white" :icon="avatar.icon.name" />
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
      <q-separator />
      <slot name="card-actions">
        <q-card-actions class="q-pa-xs" align="right">
          <k-panel id="item-actions" :content="computedActions" :context="this" />
        </q-card-actions>
      </slot>
    </q-card>
  </div>
</template>

<script>
import mixins from '../../mixins'

export default {
  name: 'k-card',
  mixins: [mixins.baseItem()],
  props: {
    itemActions: {
      type: [Object, Array],
      default: function () { return null }
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
    this.$options.components['k-text-area'] = this.$load('frame/KTextArea')
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
  }
}
</script>
