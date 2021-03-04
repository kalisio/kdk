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
        <k-panel id="modal-toolbar" :content="toolbar" />
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
        <k-panel id="modal-buttons" :content="buttons" />
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
    opened: {
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
  created () {
    // load the required components
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
  },
  mounted () {
    if (this.opened) this.$refs.modal.show()
  }
}
</script>
