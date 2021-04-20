<template>
  <div v-if="actions">
    <!--
      Render an expandable fab if more than one action is provided
     -->
    <q-fab v-if="actions.length > 1"
      id="fab"
      v-model="opened"
      :icon="icon"
      class="fixed k-fab"
      vertical-actions-align="right"
      direction="up"
      color="primary"
      persistent>
      <!-- Render a grid menu if the number of actions is higher than the expandable limit -->
      <q-menu v-if="actions.length > expandableLimit" v-model="opened" ref="menu" persistent fit anchor="top left" self="bottom right">
        <div class="q-pa-sm row" style="max-width: 50vw">
          <template v-for="action in actions">
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2" :key="action.uid">
              <k-action v-bind="action" renderer="item" @triggered="opened = false" />
            </div>
          </template>
        </div>
      </q-menu>
      <!-- Render an expandable list of actions -->
      <div v-else>
        <template v-for="action in actions">
          <k-action :key="action.uid" v-bind="action" renderer="fab" />
        </template>
      </div>
    </q-fab>
    <!--
      Render a non expandable fab if a single action is provided
     -->
    <k-action v-else-if="actions.length === 1"
      v-bind="actions[0]"
      size="1.15rem"
      :flat="false"
      renderer="button" />
  </div>
</template>

<script>
import _ from 'lodash'
import { uid } from 'quasar'
import { Layout } from '../../layout'

export default {
  name: 'k-fab',
  props: {
    expandableLimit: {
      type: Number,
      default: 8
    }
  },
  data () {
    return {
      fab: this.$store.get('fab'),
      opened: false
    }
  },
  computed: {
    icon () {
      return this.fab.icon || 'las la-ellipsis-v'
    },
    actions () {
      let fabActions = this.fab.actions
      if (!fabActions) return null
      const actions = []
      // Apply filtering
      fabActions = Layout.filterContent(fabActions, this.fab.filter || {})
      _.forEach(fabActions, (action) => {
        const isVisible = _.get(action, 'visible', true)
        if (isVisible) {
          action.uid = uid()
          if (!action.color) action.color = 'primary'
          actions.push(action)
        }
      })
      return actions
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-action'] = this.$load('frame/KAction')
  }
}
</script>

<style lang="stylus">
  .k-fab {
    right: 12px;
    bottom: 12px;
    border: 2px solid var(--q-color-secondary);
  }
</style>
