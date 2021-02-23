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
      vm.open()
      vm.$on('closed', () => vm.$router.push(from))
    })
  },
  created () {
    // Loads the required components
    this.$options.components['k-view'] = this.$load('form/KView')
  }
}
</script>
