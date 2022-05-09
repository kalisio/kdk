<template>
  <k-block v-if="user"
    id="delete-block"
    color="red"
    :title="$t('KAccountDZ.BLOCK_TITLE')"
    :text="$t('KAccountDZ.BLOCK_TEXT')"
    :action="$t('KAccountDZ.BLOCK_ACTION')"
    @action-triggered="onDeleteClicked" />
</template>

<script>
import { Dialog } from 'quasar'
import { service } from '../../mixins'
import KBlock from '../frame/KBlock.vue'

export default {
  name: 'k-account-dz',
  components: {
    KBlock
  },
  mixins: [ service ],
  data () {
    return {
      user: this.$store.get('user')
    }
  },
  methods: {
    getService () {
      return this.$api.getService('users')
    },
    onDeleteClicked () {
      Dialog.create({
        title: this.$t('KAccountDZ.DIALOG_TITLE'),
        message: this.$t('KAccountDZ.DIALOG_LABEL'),
        html: true,
        prompt: {
          type: 'text',
          model: ''
        },
        persistent: true,
        ok: {
          label: this.$t('OK'),
          flat: true
        },
        cancel: {
          label: this.$t('CANCEL'),
          flat: true
        }
      }).onOk(async (data) => {
        if (data === this.user.name) {
          try {
            await this.getService().remove(this.user._id)
          } catch (error) {
            // do not logout
            return
          }
          this.$router.push({ name: 'logout' })
        }
      })
    }
  }
}
</script>
