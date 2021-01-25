<template>
  <div>
    <!--
        Render a modal grid action if more than expandableLimit actions are provided
      -->
    <q-fab v-if="actions.length > expandableLimit"
      id="fab"
      ref="fab"
      icon="las la-chevron-up"
      class="fixed"
      style="right: 12px; bottom: 12px"
      direction ="up"
      color="primary"
      @click="toggle">
      <q-menu ref="menu" persistent fit anchor="top left" self="bottom right" content-style="background-color: lightgrey">
        <div class="q-pa-sm row q-gutter-y-sm" style="max-width: 400px">
          <template v-for="action in actions">
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2" :key="action.uid">
              <k-action v-bind="action" renderer="item" @triggered="toggle" />
            </div>
          </template>
        </div>
      </q-menu>
    </q-fab>
    <!--
      Render an expandable fab if more than one action is provided
     -->
    <q-fab v-else-if="actions.length > 1"
      id="fab"
      icon="las la-chevron-up"
      class="fixed"
      style="right: 12px; bottom: 12px"
      direction ="up"
      color="primary">
      <div v-if="actions.length <= expandableLimit">
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
      :size="actions[0].size ? actions[0].size : '1.15rem'"
      renderer="fab" />
  </div>
</template>

<script>
import _ from 'lodash'
import { uid } from 'quasar'

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
      fab: this.$store.get('fab')
    }
  },
  computed: {
    actions () {
      const actions = []
      _.forEach(this.fab.actions, (action) => {
        if (!action.status || action.status() !== 'hidden') {
          action['uid'] = uid()
          actions.push(action)
        }
      })
      return actions
    }
  },
  methods: {
    toggle () {
      this.$refs.menu.toggle()
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-action'] = this.$load('frame/KAction')
  }
}
</script>
