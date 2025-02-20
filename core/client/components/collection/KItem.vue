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
    <q-item-section v-if="avatar" top avatar @click="onItemSelected('avatar')">
      <slot name="item-avatar">
        <KAvatar
          :subject="item"
          :contextId="contextId"
          :options="options"
        />
      </slot>
    </q-item-section>
    <!--
      Content section
    -->
    <q-item-section v-show="!expanded" @click="onExpand()">
      <slot name="item-content">
        <q-item-label>{{ name }}</q-item-label>
        <q-item-label caption lines="2">
          <span v-html="description" />
        </q-item-label>
      </slot>
    </q-item-section>
    <!--
      Expanded content section
    -->
    <q-item-section v-show="expanded" @click="onExpand()">
      <KExpandable
        class="k-expandable full-width"
        :isExpanded="expanded"
        :minHeight="minHeight"
        :maxHeight="maxHeight"
      >
        <KScrollArea
          :maxHeight="maxHeight"
          :visible="true"
        >
          <slot name="item-expanded-content">
          </slot>
        </KScrollArea>
      </KExpandable>
    </q-item-section>
    <!--
      Actions section
    -->
    <q-item-section side top>
      <slot name="item-actions">
        <KPanel
          id="item-actions"
          :content="itemActions"
          :context="$props"
        />
        <KAction
          v-show="expandable"
          class="absolute-right"
          id="expand-action"
          :icon="expanded ? 'las la-angle-up' : 'las la-angle-down'"
          size="sm"
          :handler="onExpand"
        />
      </slot>
    </q-item-section>
  </q-item>
</template>

<script>
import KAvatar from '../KAvatar.vue'
import KExpandable from '../KExpandable.vue'
import KScrollArea from '../KScrollArea.vue'
import { baseItem } from '../../mixins'

export default {
  components: {
    KAvatar,
    KExpandable,
    KScrollArea
  },
  mixins: [baseItem],
  props: {
    expandable: {
      type: Boolean,
      default: false
    },
    minHeight: {
      type: Number,
      default: 0
    },
    maxHeight: {
      type: Number,
      default: 300
    }
  },
  data () {
    return {
      toggled: false,
      expanded: false
    }
  },
  methods: {
    onExpand () {
      if (this.expandable) {
        this.expanded = !this.expanded
        this.onItemExpanded(this.expanded)
      }
      this.onItemSelected('content')
    }
  }
}
</script>

<style lang="scss">
  .selected {
    font-weight: bold;
  }
  .k-expandable {
    position: relative;
  }
</style>
