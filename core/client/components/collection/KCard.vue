<template>
  <div :class="getLayout()">
    <q-card  @click="onItemSelected">
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
            <span class="text-subtitle1 text-weight-medium ellipsis">{{ name }}</span>
            <k-text-area :length="30" :text="description" />
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
      <q-card-actions class="q-pa-xs" align="right">
        <!-- Pane -->
        <k-tool-bar :actions="itemActions.pane" :context="item" :dense="$q.screen.lt.md" />
        <!-- Menu -->
        <k-overflow-menu :actions="itemActions.menu" :context="item" :dense="$q.screen.lt.md" />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script>
import _ from 'lodash'
import { getInitials } from '../../utils'
import mixins from '../../mixins'

export default {
  name: 'k-card',
  mixins: [mixins.baseItem],
  props: {
    itemActions: {
      type: Object,
      default: function () {
        return {
          pane: [],
          menu: []
        }
      }
    }
  },
  computed: {
    avatar () {
      const icon = this.getIcon()
      if (icon) {
        return {
          type: 'icon',
          icon
        }
      }
      const name = this.getName()
      return {
        type: 'text',
        text: getInitials(name)
      }
    },
    name () {
      // Check for custom name field
      return this.getName()
    },
    description () {
      // Check for custom description field
      return this.getDescription()
    }
  },
  methods: {
    getLayout () {
      return _.get(this.options, 'layout', 'col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3')
    },
    getIcon () {
      return this.options.iconField ? _.get(this.item, this.options.iconField, '') : this.item.icon
    },
    getName () {
      return this.options.nameField ? _.get(this.item, this.options.nameField, '') : this.item.name
    },
    getDescription () {
      return this.options.descriptionField ? _.get(this.item, this.options.descriptionField, '') : this.item.description
    }
  },
  created () {
    // Loads the required components
    this.$options.components['k-text-area'] = this.$load('frame/KTextArea')
    this.$options.components['k-tool-bar'] = this.$load('layout/KToolBar')
    this.$options.components['k-overflow-menu'] = this.$load('layout/KOverflowMenu')
  }
}
</script>
