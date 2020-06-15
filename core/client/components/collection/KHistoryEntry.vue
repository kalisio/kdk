<template>
  <q-timeline-entry :class="layout()" :side="item.side" :icon="iconName" :color="iconColor" @click="onItemSelected">
    <!--
      Title section
    -->
    <template v-slot:title>
      <slot name="entry-title">
        {{ name }}
      </slot>
    </template>
    <!--
      Date section
    -->
    <template v-slot:subtitle>
      <slot name="entry-date">
        <div v-if="date">{{ date.toLocaleString() }}</div>
      </slot>
    </template>
    <!--
      Content section
    -->
    <q-card bordered>
      <q-card-section class="q-pa-xs">
        <slot name="entry-content">
          <k-text-area class="q-pa-xs" :length="50" :text="description" />
        </slot>
      </q-card-section>
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
  </q-timeline-entry>
</template>

<script>
import _ from 'lodash'
import { getIconName } from '../../utils'
import mixins from '../../mixins'

export default {
  name: 'k-history-entry',
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
    name () {
      // Check for custom name field
      return (this.options.nameField ? _.get(this.item, this.options.nameField, '') : this.item.name)
    },
    description () {
      // Check for custom description field
      return this.options.descriptionField ? _.get(this.item, this.options.descriptionField, '') : this.item.description
    },
    date () {
      // Check for custom date field
      const date = (this.options.dateField ? _.get(this.item, this.options.dateField, '') : this.item.createdAt)
      return date ? new Date(date) : null
    },
    iconName () {
      // Check for custom icon field
      return this.options.iconNameField ? getIconName(this.item, this.options.iconNameField) : getIconName(this.item, 'icon.name')
    },
    iconColor () {
      // Check for custom icon field
      return this.options.iconColorField ? _.get(this.item, this.options.iconColorField, '') : _.get(this.item, 'icon.color', '')
    }
  },
  methods: {
    layout () {
      return _.get(this.options, 'layout', 'col-xs-12 col-sm-10 col-md-8 col-lg-6 col-xl-6')
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
