<template>
  <k-modal ref="modal" :title="viewerTitle" :toolbar="toolbar" :buttons="[]">
    <div slot="modal-content">
      <k-view ref="view" :values="object" :schema="schema" />
    </div>
  </k-modal>
</template>

<script>
import mixins from '../../mixins'
import { KModal } from '../frame'

export default {
  name: 'k-modal-viewer',
  components: {
    KModal
  },
  mixins: [
    mixins.baseViewer,
    mixins.service,
    mixins.objectProxy,
    mixins.schemaProxy
  ],
  data () {
    return {
      toolbar: [{
        id: 'close-viewer',
        icon: 'las la-times',
        handler: () => this.close()
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
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // open the modal
      vm.open()
      // redirect to the parent route when closing
      if (to.matched.length > 1) vm.$on('closed', () => vm.$router.push(to.matched.slice(-2).shift()))
    })
  },
  created () {
    // Loads the required components
    this.$options.components['k-view'] = this.$load('form/KView')
  }
}
</script>
