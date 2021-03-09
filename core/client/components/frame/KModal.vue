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
        <k-panel id="modal-toolbar" :content="toolbarContent" />
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
      default: () => null
    },
    buttons: {
      type: Array,
      default: () => null
    },
    maximized: {
      type: Boolean,
      default: false
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
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    toolbarContent () {
      if (!this.toolbar) {
        return [
          { id: 'close-modal', icon: 'las la-times', tooltip: 'KModal.CLOSE_ACTION', handler: () => this.close() }
        ]
      }
      return this.toolbar
    }
  },
  watch: {
    value: function (opened) {
      if (opened) this.$refs.modal.show()
      else this.$refs.modal.hide()
    }
  },
  methods: {
    open () {
      this.$refs.modal.show()
    },
    openMaximized () {
      //this.maximized = true
      this.$refs.modal.show()
    },
    close () {
      this.$refs.modal.hide()
      this.$emit('input', false)
    }
  },
  created () {
    // load the required components
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
  },
  mounted () {
    if (this.value) this.$refs.modal.show()
  }
}
</script>
