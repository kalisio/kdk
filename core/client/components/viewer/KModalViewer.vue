<template>
  <k-modal ref="modal" :title="viewerTitle" :toolbar="toolbar" :buttons="[]" :route="router ? true : false" >
    <div slot="modal-content">
      <k-view ref="view" :values="object" :schema="schema" />
    </div>
  </k-modal>
</template>

<script>
import mixins from '../../mixins'

export default {
  name: 'k-modal-viewer',
  mixins: [
    mixins.baseViewer,
    mixins.service,
    mixins.objectProxy,
    mixins.schemaProxy,
  ],
  props: {
    router: {
      type: Object,
      default: () => { return null }
    }
  },
  data () {
    return {
      toolbar: [{
        name: 'close',
        icon: 'close',
        handler: () => {
          this.close()
          if (this.router) this.$router.push(this.router.onDismiss)
        }
      }]
    }
  },
  methods: {
    open () {
      this.refresh()
      this.$refs.modal.open()
    },
    close () {
      this.$refs.modal.close()
      this.$emit('closed')
    }
  },
  created () {
    // Loads the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-view'] = this.$load('form/KView')
    // Refresh the editor only when using a router. Otherwise it will be done when opening the editor
    if (this.router) this.refresh()
    this.$on('applied', _ => {
      if (this.router) {
        this.close()
        this.$router.push(this.router.onApply)
      }
    })
  }
}
</script>
