<template>
  <k-modal ref="modal" :title="editorTitle" :toolbar="toolbar" :buttons="buttons" :route="router ? true : false" >
    <div slot="modal-content">
      <k-form :class="{ 'light-dimmed': applyInProgress }" ref="form" :schema="schema" @field-changed="onFieldChanged"/>
      <q-spinner-cube color="primary" class="fixed-center" v-if="applyInProgress" size="4em"/>
    </div>
  </k-modal>
</template>

<script>
import { KModal } from '../frame'
import { KForm } from '../form'
import mixins from '../../mixins'

export default {
  name: 'k-modal-editor',
  components: {
    KModal,
    KForm
  },
  mixins: [
    mixins.service,
    mixins.objectProxy,
    mixins.schemaProxy,
    mixins.baseEditor(['form']),
    mixins.refsResolver(['form'])
  ],
  props: {
    router: {
      type: Object,
      default: () => { return null }
    }
  },
  computed: {
    buttons () {
      const buttons = [{
        name: 'apply-button', label: this.applyButton, color: 'primary', handler: () => this.apply()
      }]
      if (this.clearButton !== '') {
        buttons.push({
          name: 'clear-button', label: this.clearButton, color: 'primary', handler: () => this.clear()
        })
      }
      if (this.resetButton !== '') {
        buttons.push({
          name: 'reset-button', label: this.resetButton, color: 'primary', handler: () => this.reset()
        })
      }
      return buttons
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
    },
    onFieldChanged (field, value) {
      this.$emit('field-changed', field, value)
    }
  },
  created () {
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
