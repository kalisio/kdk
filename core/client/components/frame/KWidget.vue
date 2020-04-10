<template>
  <div v-show="isOpened" class="k-widget">
    <div class="row justify-between no-wrap">
      <!--
        Title section
      -->
      <div class="q-pl-sm q-pt-xs text-subtitle1">
        {{title}}
      </div>
      <!--
       Toolbar section
      -->
      <div>
        <k-tool-bar :actions="actions" dense />
      </div>
    </div>
    <!--
      Content section
    -->
    <slot name="widget-content" />
  </div>
</template>

<script>
export default {
  name: 'k-widget',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  computed: {
    actions () {
      return [
        {
          name: 'change-mode',
          label: this.$t(this.mode === 'minimized' ? 'KWidget.MINIMIZE_ACTION' : 'KWidget.MAXIMIZE_ACTION'),
          icon: this.mode === 'minimized' ? 'fullscreen' : 'fullscreen_exit',
          handler: () => this.toggleMode()
        },
        {
          name: 'close-action',
          label: this.$t('KWidget.CLOSE_ACTION'),
          icon: 'close',
          handler: () => this.close()
        }
      ]
    }
  },
  data () {
    return {
      mode: 'minimized',
      isOpened: false
    }
  },
  methods: {
    async setMode (mode) {
      this.mode = mode
      this.$emit('state-changed', this.mode)
    },
    async toggleMode () {
      await this.setMode(this.mode === 'minimized' ? 'maximized' : 'minimized')
    },
    open () {
      this.isOpened = true
      this.$emit('state-changed', this.mode)
    },
    close () {
      this.isOpened = false
      this.$emit('state-changed', 'closed')
    },
    toggle () {
      if (!this.isOpened) {
        this.open()
      } else {
        this.close()
      }
    },
    isOpen () {
      return this.isOpened
    },
    isMinimized () {
      return (this.mode === 'minimized')
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-tool-bar'] = this.$load('layout/KToolBar')
  }
}
</script>

<style lang="stylus">
.k-widget
  border: solid 1px lightgrey;
  border-radius: 5px;
  background: #ffffff

.k-widget:hover
  border: solid 1px $primary;
</style>
