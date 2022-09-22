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
      <q-item-section v-show="!expanded" @click="onItemSelected('content')">
        <q-item-label>{{ name }}</q-item-label>
        <q-item-label caption lines="2">
          <span v-html="description" />
        </q-item-label>
      </q-item-section>
    </slot>
    <!--
      Expanded content section
    -->
    <KExpandable v-show="expandable"
      class="k-expandable"
      v-model="expanded"
      :minHeight="minHeight" 
      :maxHeight="maxHeight"
    >
      <!--KScrollArea 
        :maxHeight="maxHeight"
        :visible="expanded"
      -->
        <slot name="item-expanded-content">
        </slot>
      <!--/KScrollArea-->
    </KExpandable>
    <!--
      Actions section
    -->
    <slot name="item-actions">
      <k-panel id="item-actions" :content="itemActions" :context="$props" />
      <span>
        <KAction v-show="expandable" class="absolute-right"
          :icon="expanded ? 'las la-angle-up' : 'las la-angle-down'"
          :handler="onExpand"
        />
      </span>
    </slot>
  </q-item>
</template>

<script>
import { KPanel, KAvatar, KExpandable, KScrollArea } from '../frame'
import { baseItem } from '../../mixins'

export default {
  components: {
    KPanel,
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
      this.expanded = !this.expanded
      this.onItemExpanded(this.expanded)
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
