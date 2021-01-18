<template>
  <q-timeline-entry :class="layout()" :side="item.side" :icon="avatar.icon.name" :color="avatar.icon.color" @click="onItemSelected">
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
      Card section
    -->
    <q-card bordered>
      <!--
        Content section
      -->
      <slot name="entry-content">
        <q-item>
          <q-item-section>
            <k-text-area :text="description" />
          </q-item-section>
        </q-item>
      </slot>
      <!--
        Actions section
      -->
      <q-separator />
      <slot name="entry-actions">
        <q-card-actions class="q-pa-xs" align="right">
          <k-panel id="card-actions" :content="itemActions" mode="pane" :context="item" />
        </q-card-actions>
      </slot>
    </q-card>
  </q-timeline-entry>
</template>

<script>
import _ from 'lodash'
import mixins from '../../mixins'

export default {
  name: 'k-history-entry',
  mixins: [mixins.baseItem],
  props: {
    itemActions: {
      type: [Object, Array],
      default: () => { return null }
    }
  },
  computed: {
    date () {
      return this.getDate()
    }
  },
  methods: {
    layout () {
      return _.get(this.options, 'layout', 'col-xs-12 col-sm-10 col-md-8 col-lg-6 col-xl-6')
    },
    getDate () {
      // Check for custom date field
      const date = (this.options.dateField ? _.get(this.item, this.options.dateField, '') : this.item.createdAt)
      return date ? new Date(date) : null
    }
  },
  created () {
    // Loads the required components
    this.$options.components['k-text-area'] = this.$load('frame/KTextArea')
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
    this.$options.components['k-overflow-menu'] = this.$load('frame/KOverflowMenu')
  }
}
</script>
