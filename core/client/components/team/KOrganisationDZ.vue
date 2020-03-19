<template>
  <div v-if="name !== ''">
    <k-block
      color="red"
      :title="$t('KOrganisationDZ.BLOCK_TITLE')"
      :text="$t('KOrganisationDZ.BLOCK_TEXT', {organisation: name})"
      :action="$t('KOrganisationDZ.BLOCK_ACTION')"
      @action-triggered="onDeleteClicked" />
  </div>
</template>

<script>
import { Dialog } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-organisation-dz',
  mixins: [
    mixins.objectProxy
  ],
  data () {
    return {
      name: ''
    }
  },
  methods: {
    loadService () {
      return this.$api.getService('organisations')
    },
    onDeleteClicked () {
      Dialog.create({
        title: this.$t('KOrganisationDZ.DIALOG_TITLE', { organisation: this.name }),
        message: this.$t('KOrganisationDZ.DIALOG_HELPER'),
        html: true,
        prompt: {
          type: 'text',
          model: ''
        },
        buttons: [
          {
            label: this.$t('OK'),
            preventClose: true

          }, {
            label: this.$t('CANCEL')
          }
        ]
      }).onOk(async (data) => {
        if (data === this.name) {
          await this.loadService().remove(this.objectId)
          this.$router.push({ name: 'home' })
        }
      })
    }
  },
  async created () {
    // Load the components
    this.$options.components['k-block'] = this.$load('frame/KBlock')
    // Update underlying object
    const object = await this.loadObject()
    this.name = object.name
  }
}
</script>
