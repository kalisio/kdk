<template>
  <k-modal :id="getSchemaId() + 'editor'" ref="modal" :title="editorTitle" :toolbar="toolbar" :buttons="buttons" c>
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
  computed: {
    buttons () {
      const buttons = [{
        id: 'apply-button', label: this.applyButton, color: 'primary', handler: () => this.apply()
      }]
      if (this.clearButton !== '') {
        buttons.push({
          id: 'clear-button', label: this.clearButton, color: 'primary', handler: () => this.clear()
        })
      }
      if (this.resetButton !== '') {
        buttons.push({
          id: 'reset-button', label: this.resetButton, color: 'primary', handler: () => this.reset()
        })
      }
      return buttons
    }
  },
  data () {
    return {
      toolbar: [{
        id: 'close-editor',
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
    },
    onFieldChanged (field, value) {
      this.$emit('field-changed', field, value)
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      // open the modal
      vm.open()
      // redirect to the parent route when closing
      // see: https://github.com/vuejs/vue-router/issues/216
      if (to.matched.length > 1) vm.$on(['closed', 'applied'], () => vm.$router.push(to.matched.slice(-2).shift()))
    })
  }
}
</script>
