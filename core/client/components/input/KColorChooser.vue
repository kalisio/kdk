<template>
  <k-modal ref="modal" :buttons="getButtons()">
    <div slot="modal-content">
      <div class="column q-gutter-sm">
        <div class="row justify-between items-center q-gutter-sm">
          <k-palette shape="round" v-model="selectedColor" />
        </div>
      </div>
    </div>
  </k-modal>
</template>

<script>
export default {
  name: 'k-color-chooser',
  data () {
    return {
      selectedColor: 'dark'
    }
  },
  methods: {
    getButtons () {
      return [
        { 
          id: 'cancel-action', 
          label: 'KColorChooser.CANCEL_BUTTON', 
          icon: 'las la-times', 
          renderer: 'form-button',
          outline: true,
          handler: () => this.doClose() 
        },
        { 
          id: 'done-button', 
          label: 'KColorChooser.DONE_BUTTON',
          renderer: 'form-button',
          handler: (event) => this.doDone(event) 
        }
      ]
    },
    open (defaultColor) {
      this.selectedColor = defaultColor
      // Open the modal
      this.$refs.modal.open()
    },
    iconSelected () {
      return this.selectedIcon.name.length > 0
    },
    doDone (event) {
      this.$emit('color-choosed', this.selectedColor)
      this.doClose()
    },
    doClose (event) {
      this.$refs.modal.close()
    }
  },
  beforeCreate () {
    // Load the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-palette'] = this.$load('input/KPalette')
  }
}
</script>
