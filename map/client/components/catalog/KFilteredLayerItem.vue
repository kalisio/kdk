<template>
  <k-layer-item v-if="!layer.filters" v-bind="$props" :layer="layer"/>
  <q-tree v-else :nodes="[layer]"
    dense node-key="label" label-key="label" children-key="filters">
    <template v-slot:default-header="prop">
      <!-- Layer rendering -->
      <k-layer-item v-if="prop.node.name" v-bind="$props" :layer="layer" @toggled="onToggled"/>
      <!-- Filter rendering -->
      <div v-else class="row items-center q-pl-md q-pr-sm no-wrap">
        <!-- Filter toggle -->
        <q-toggle v-model="prop.node.isActive" :disable="layer.isDisabled" size="sm" @update:modelValue="onFilterToggled(prop.node)" />
        <div :class="{
            'text-primary': layer.isVisible,
            'text-grey-6': layer.isDisabled
          }">
          {{ prop.node.label }}
          <q-tooltip
            v-if="(prop.node.tooltip || prop.node.description) && $q.platform.is.desktop" :delay="1000"
            anchor="center left"
            self="center right"
            :offset="[20, 0]">
            {{ prop.node.tooltip || prop.node.description }}
          </q-tooltip>
        </div>
      </div>
    </template>
  </q-tree>
</template>

<script>
import KLayerItem from './KLayerItem.vue'

export default {
  name: 'k-filtered-layer-item',
  components: {
    KLayerItem
  },
  props: {
    layer: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    onToggled () {
      this.$emit('toggled', this.layer)
    },
    onFilterToggled (filter) {
      this.$emit('filter-toggled', this.layer, filter)
    }
  }
}
</script>
