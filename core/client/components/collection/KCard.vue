<template>
  <q-card bordered @click="onItemSelected">
    <!--
      Header section
    -->
    <slot name="card-header">
      <div v-bind:class="{ 'q-px-sm q-py-xs': dense, 'q-px-md q-py-sm': !dense }">
        <k-panel v-if="header" :content="header" :context="$props" />
      </div>
    </slot>
    <!--
      Title section
    -->
    <slot name="card-title">
      <div v-bind:class="{ 'q-px-sm q-py-xs': dense, 'q-px-md q-py-sm': !dense }">
        <q-list dense>
          <q-item dense>
            <q-item-section top avatar>
              <slot name="card-avatar">
                <k-avatar 
                  :object="item" 
                  :size="dense ? 'sm' : 'md'" 
                  :contextId="contextId" 
                  :options="options" />
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
        </q-list>
      </div>
    </slot>
    <!--
      Content section
    -->
    <div v-bind:class="{ 'q-px-sm q-py-xs': dense, 'q-px-md q-py-sm': !dense }">
      <slot name="card-content" />
    </div>
    <!--
      Actions section
    -->
    <slot name="card-actions">
      <div v-if="hasActions">
        <q-separator />
        <q-card-actions v-bind:class="{ 'q-px-sm q-py-xs': dense, 'q-px-md q-py-sm': !dense }" align="right">
          <k-panel id="card-actions" :content="itemActions" :context="$props" />
        </q-card-actions>
      </div>
    </slot>
  </q-card>
</template>

<script>
import { KPanel, KAvatar, KTextArea } from '../frame'
import mixins from '../../mixins'

export default {
  name: 'k-card',
  components: {
    KPanel,
    KAvatar,
    KTextArea
  },
  mixins: [mixins.baseItem],
  props: {
    header: {
      type: [Object, Array],
      default: () => null
    },
    dense: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    hasActions () {
      return !_.isEmpty(this.itemActions)
    }
  }
}
</script>
