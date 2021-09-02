<template>
  <q-dialog
    ref="modal"
    persistent
    :maximized="maximized"
    @show="$emit('opened')"
    @hide="$emit('closed')">
    <q-card 
      v-bind:class="{ 
        'column full-height': maximized,
        'q-pa-sm': $q.screen.gt.xs,
        'q-ps-xs': $q.screen.lt.sm
      }"
      :style="computedStyle">
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
      <q-card-section class="col">
        <slot name="modal-content" />
      </q-card-section>
      <!--
        Buttons section
       -->
      <q-card-actions v-if="buttons" align="right">
        <k-panel 
          id="modal-buttons" 
          :content="buttons" 
          :action-renderer="'form-button'" 
          v-bind:class="{ 'q-gutter-x-md' : $q.screen.gt.xs, 'q-gutter-x-sm': $q.screen.lt.sm }" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import KPanel from './KPanel.vue'

export default {
  name: 'k-modal',
  components: {
    KPanel
  },
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
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    computedStyle () {
      if (this.maximized) return ''
      if (this.$q.screen.lt.sm) return 'min-width: 100vw; max-height: 90vh'
      if (this.$q.screen.lt.md) return 'min-width: 90vw; max-height: 90vh'
      if (this.$q.screen.lt.lg) return 'min-width: 80vw; max-height: 90vh'
      if (this.$q.screen.lt.xl) return 'min-width: 70vw; max-height: 90vh'
      return 'min-width: 60vw; max-height: 90vh'
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
      // this.maximized = true
      this.$refs.modal.show()
    },
    close () {
      this.$refs.modal.hide()
      this.$emit('input', false)
    }
  },
  mounted () {
    if (this.value) this.$refs.modal.show()
  }
}
</script>
