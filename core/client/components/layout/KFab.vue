<template>
  <div>
    <!--
        Render a modal grid action if more than expandableLimit actions are provided
      -->
    <div v-if="fab.actions.length > expandableLimit">
      <k-modal ref="modal" :toolbar="getModalToolbar()" :buttons="getModalButtons()" :options="getModalOptions()" :route="false">
        <div slot="modal-content">
          <div class="row q-gutter-sm full-width">
            <div class="col-xs-6 col-sm-6 col-md-4 col-lg-3 col-xl-2" align="center" v-for="action in fab.actions" :key="action.id">
              <q-btn
                :id="action.id"
                color="secondary"
                round
                @click="closeModal(action)">
                <q-icon :name="action.icon" />
              </q-btn>
              <br/>
              <p>
                {{action.label}}
              </p>
            </div>
          </div>
        </div>
      </k-modal>
      <q-btn
        id="modal-action"
        color="secondary"
        round
        @click="openModal()">
        <q-icon name="las la-chevron-up" />
      </q-btn>
    </div>
    <!--
      Render an expandable fab if more than one action is provided
     -->
    <q-fab v-else-if="fab.actions.length > 1"
      id="fab"
      icon="las la-chevron-up"
      class="fixed"
      style="right: 18px; bottom: 18px"
      direction ="up"
      color="secondary">
        <q-fab-action
          v-for="action in fab.actions"
          :id="action.id"
          :key="action.id"
          color="secondary"
          @click="onActionTriggered(action)"
          :icon="action.icon">
          <!-- tooltip -->
          <q-tooltip v-if="action.label" anchor="center left" self="center right" :offset="[20, 0]">
            {{action.label}}
          </q-tooltip>
          <!-- badge -->
          <q-badge v-if="action.badge" v-bind="action.badge">
            <q-icon v-if="action.badge.icon" v-bind="action.badge.icon" />
          </q-badge>
        </q-fab-action>
    </q-fab>
    <!--
      Render a non expandable fab if a single action is provided
     -->
    <q-btn v-else-if="fab.actions.length > 0"
      :id="fab.actions[0].id"
      color="secondary"
      :icon="fab.actions[0].icon"
      size="1.15rem"
      round
      @click="onActionTriggered(fab.actions[0])">
      <q-tooltip v-if="fab.actions[0].label" anchor="center left" self="center right" :offset="[20, 20]">
        {{fab.actions[0].label}}
      </q-tooltip>
    </q-btn>
  </div>
</template>

<script>
import _ from 'lodash'

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
  methods: {
    getModalToolbar () {
      return [
        { name: 'close-action', label: this.$t('KFab.CLOSE_ACTION'), icon: 'las la-times', handler: () => this.closeModal() }
      ]
    },
    getModalButtons () {
      return []
    },
    getModalOptions () {
      return {
        padding: '4px',
        minWidth: '60vw',
        maxWidth: '80vw',
        minHeight: '20vh'
      }
    },
    openModal () {
      this.$refs.modal.open()
    },
    closeModal (action) {
      this.$refs.modal.close()
      if (!_.isNil(action)) this.onActionTriggered(action)
    },
    onActionTriggered (action) {
      // If a handler is given call it
      if (action.handler) action.handler.call(this)
      // If a route is given activate it
      else if (action.route) this.$router.push(action.route)
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
  }
}
</script>
