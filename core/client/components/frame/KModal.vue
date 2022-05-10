<template>
  <q-dialog
    ref="modal"
    persistent
    :maximized="maximized"
    @show="$emit('opened')"
    @hide="$emit('closed')">
    <q-card
      id="modal-card"
      v-bind:class="{
        'column full-height': maximized,
        'q-pa-sm': $q.screen.gt.xs,
        'q-pa-xs': $q.screen.lt.sm
      }"
      :style="innerStyle">
      <!--
         Header section
       -->
      <div id ="modal-header"
        class="row full-width justify-between items-center"
        v-bind:class="{'q-pa-md': $q.screen.gt.xs, 'q-pa-sm': $q.screen.lt.sm }"
      >
        <q-resize-observer @resize="onHeaderResized" />
        <span class="ellipsis text-h6" v-html="title" />
        <k-panel
          id="modal-toolbar"
          :content="toolbar"
          v-bind:class="{ 'q-gutter-x-md' : $q.screen.gt.xs, 'q-gutter-x-sm': $q.screen.lt.sm }" />
      </div>
      <!--
        Content section
       -->
      <div id="modal-content"
        class="col"
        v-bind:class="{'q-pa-sm': $q.screen.gt.xs, 'q-pa-xs': $q.screen.lt.sm }"
      >
        <slot name="modal-content">
          <k-scroll-area class="q-pl-xs q-pr-lg" :maxHeight="scrollAreaMaxHeight">
            <slot />
          </k-scroll-area>
        </slot>
      </div>
      <!--
        Footer section
       -->
      <div id="modal-footer" v-if="buttons"
        class="q-pa-md row full-width justify-end"
        v-bind:class="{'q-pa-md': $q.screen.gt.xs, 'q-pa-sm': $q.screen.lt.sm }"
      >
        <q-resize-observer @resize="onFooterResized" />
        <k-panel
          id="modal-buttons"
          :content="buttons"
          :action-renderer="'form-button'"
          v-bind:class="{ 'q-gutter-x-md' : $q.screen.gt.xs, 'q-gutter-x-sm': $q.screen.lt.sm }" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import KScrollArea from './KScrollArea.vue'
import KPanel from './KPanel.vue'

export default {
  name: 'k-modal',
  emits: ['update:modelValue', 'opened', 'closed'],
  components: {
    KScrollArea,
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
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    innerStyle () {
      const screenHeight = this.$q.screen.height
      const modalMaxHeight = this.maximized ? screenHeight : 0.8 * screenHeight
      // take into account the header and footer height
      this.scrollAreaMaxHeight = modalMaxHeight - this.headerHeight - this.footerHeight
      // take into account overall padding
      const cardElement = document.getElementById('modal-card')
      if (cardElement) {
        this.scrollAreaMaxHeight -= parseInt(window.getComputedStyle(cardElement).getPropertyValue('padding-top'))
        this.scrollAreaMaxHeight -= parseInt(window.getComputedStyle(cardElement).getPropertyValue('padding-bottom'))
      }
      const contentElement = document.getElementById('modal-content')
      if (contentElement) {
        this.scrollAreaMaxHeight -= parseInt(window.getComputedStyle(contentElement).getPropertyValue('padding-top'))
        this.scrollAreaMaxHeight -= parseInt(window.getComputedStyle(contentElement).getPropertyValue('padding-bottom'))
      }
      // return the style
      if (this.maximized) return ''
      if (this.$q.screen.lt.sm) return `min-width: 100vw; max-height: ${modalMaxHeight}px`
      if (this.$q.screen.lt.md) return `min-width: 90vw; max-height: ${modalMaxHeight}px`
      if (this.$q.screen.lt.lg) return `min-width: 80vw; max-height: ${modalMaxHeight}px`
      if (this.$q.screen.lt.xl) return `min-width: 70vw; max-height: ${modalMaxHeight}px`
      return `min-width: 60vw; max-height: ${modalMaxHeight}px`
    }
  },
  data () {
    return {
      scrollAreaMaxHeight: 0,
      headerHeight: 0,
      footerHeight: 0
    }
  },
  watch: {
    modelValue: {
      handler (value) {
        if (value) this.$refs.modal.show()
        else this.$refs.modal.hide()
      }
    }
  },
  methods: {
    open () {
      this.$refs.modal.show()
      this.$emit('update:modelValue', true)
    },
    close () {
      this.$refs.modal.hide()
      tthis.$emit('update:modelValue', false)
    },
    onHeaderResized (size) {
      this.headerHeight = size.height
    },
    onFooterResized (size) {
      this.footerHeight = size.height + 16
    }
  },
  mounted () {
    if (this.modelValue) this.$refs.modal.show()
  }
}
</script>
