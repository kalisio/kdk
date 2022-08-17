<template>
  <div v-if="actions" id="fab-container">
    <!--
      Render an expandable fab if more than one action is provided
     -->
    <q-fab v-if="actions.length > 1"
      id="fab"
      v-model="isOpened"
      :icon="icon"
      class="fixed k-fab"
      vertical-actions-align="right"
      direction="up"
      color="primary"
      persistent>
      <!-- Render a grid menu if the number of actions is higher than the expandable limit -->
      <q-menu v-if="actions.length > expandableLimit" v-model="isOpened" ref="menu" persistent fit anchor="top left" self="bottom right">
        <div class="q-pa-sm row" style="max-width: 50vw">
          <template v-for="action in actions" :key="action.uid">
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
              <KAction v-bind="action" renderer="item" @triggered="isOpened = false" />
            </div>
          </template>
        </div>
      </q-menu>
      <!-- Render an expandable list of actions -->
      <div v-else>
        <template v-for="action in actions" :key="action.uid">
          <KAction v-bind="action" renderer="fab-action" />
        </template>
      </div>
    </q-fab>
    <!--
      Render a non expandable fab if a single action is provided
     -->
    <KAction v-else-if="actions.length === 1"
      v-bind="actions[0]"
      size="1.15rem"
      renderer="fab"
    />
  </div>
</template>

<script>
import _ from 'lodash'
import { uid } from 'quasar'
import { Layout } from '../../layout'
import KAction from '../frame/KAction.vue'

export default {
  components: {
    KAction
  },
  props: {
    expandableLimit: {
      type: Number,
      default: 8
    }
  },
  data () {
    return {
      fab: this.$store.get('fab'),
      isOpened: false
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
        let isVisible = _.get(action, 'visible', true)
        // Can be a functional call
        if (typeof isVisible === 'function') {
          isVisible = isVisible()
        }
        if (isVisible) {
          action.uid = uid()
          if (!action.color) action.color = 'primary'
          actions.push(action)
        }
      })
      return actions
    }
  }
}
</script>

<style lang="scss">
  .k-fab {
    right: 12px;
    bottom: 12px;
    border: 2px solid var(--q-secondary);
  }
</style>
