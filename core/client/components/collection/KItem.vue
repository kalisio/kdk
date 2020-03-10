<template>
  <q-item active-class="selected" class="cursor-pointer">
    <!--
      Avatar section
    -->
    <slot name="item-avatar">
      <q-item-section @click="onItemSelected" avatar v-if="avatar">
        <q-avatar>
          <img :src="avatar">
        </q-avatar>
      </q-item-section>
      <q-item-section @click="onItemSelected" avatar v-if="icon">
        <q-icon :color="icon.color" :name="icon.name" />
      </q-item-section>
    </slot>
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
        <k-overflow-menu :actions="itemActions" :context="item" :dense="$q.screen.lt.md" />
      </q-item-section>
    </slot>
  </q-item>
</template>

<script>
import _ from 'lodash'
import mixins from '../../mixins'

export default {
  name: 'k-item',
  mixins: [mixins.baseItem],
  props: {
    itemActions: {
      type: Array,
      default: () => { return [] }
    }
  },
  computed: {
    name () {
      // Check for custom name field
      return (this.options.nameField ? _.get(this.item, this.options.nameField, '') : this.item.name)
    },
    description () {
      // Check for custom description field
      return this.options.descriptionField ? _.get(this.item, this.options.descriptionField, '') : this.item.description
    },
    avatar () {
      if (this.item.avatar) return this.item.avatar
      return undefined
    },
    icon () {
      if (this.item.icon) return this.item.icon
      return undefined
    }
  },
  methods: {
    key (object, property) {
      return this.item._id + '-' + object[property]
    }
  },
  created () {
    // Loads the required components
    this.$options.components['k-overflow-menu'] = this.$load('layout/KOverflowMenu')
  }
}
</script>

<style>
.selected {
  font-weight: bold;
}
</style>
