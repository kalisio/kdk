<template>
  <q-dialog
    ref="modal"
    persistent
    :maximized="maximized"
    @show="$emit('opened')"
    @hide="$emit('closed')">
    <q-card :class="contentClass" :style="maximized ? '' : contentStyle">
      <!--
         Toolbar section
       -->
      <q-toolbar>
        <q-toolbar-title>
          <span class="ellipsis">{{ title }}</span>
        </q-toolbar-title>
        <q-space />
        <template v-for="action in toolbar">
          <q-btn  class="items-start" :id="action.name" v-bind:key="action.name" flat round dense @click="action.handler">
            <q-icon :name="action.icon" :color="action.color || 'primary'"/>
            <q-tooltip v-if="action.label">{{action.label}}</q-tooltip>
          </q-btn>
        </template>
      </q-toolbar>
      <!--
        Content section
       -->
      <q-card-section>
        <slot name="modal-content" />
      </q-card-section>
      <!--
        Buttons section
       -->
      <q-card-actions align="right">
        <template v-for="button in buttons">
          <q-btn :id="button.name" :key="button.name" flat :color="button.color || 'primary'"
            :label="button.label" @click="button.handler"/>
        </template>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'k-modal',
  props: {
    title: {
      type: String,
      default: ''
    },
    toolbar: {
      type: Array,
      default: () => { return [] }
    },
    buttons: {
      type: Array,
      default: () => { return [] }
    },
    contentClass: {
      type: String,
      default: 'q-pa-xs q-ma-xs'
    },
    contentStyle: {
      type: String,
      default: () => {
        if (window.innerWidth < 599) {
          return 'min-width: 100vw; max-height: 90vh'
        }
        if (window.innerWidth < 1023) {
          return 'min-width: 80vw; max-height: 90vh'
        }
        if (window.innerWidth < 1439) {
          return 'min-width: 60vw; max-height: 90vh'
        }
        if (window.innerWidth < 1919) {
          return 'min-width: 50vw; max-height: 90vh'
        }
        return 'min-width: 40vw; max-height: 90vh'
      }
    },
    route: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      maximized: false
    }
  },
  methods: {
    open () {
      this.maximized = false
      this.$refs.modal.show()
    },
    openMaximized () {
      this.maximized = true
      this.$refs.modal.show()
    },
    close () {
      this.$refs.modal.hide()
    }
  },
  mounted () {
    if (this.route) this.open()
  }
}
</script>
