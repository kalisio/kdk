<template>
  <KBlock
    v-if="user"
    id="delete-block"
    color="#FFAAAA"
    :title="$t('KAccountDZ.BLOCK_TITLE')"
    :text="$t('KAccountDZ.BLOCK_TEXT')"
    :action="getDeleteAction()"
  />
</template>

<script>
import { Dialog } from 'quasar'
import KBlock from '../frame/KBlock.vue'

export default {
  components: {
    KBlock
  },
  data () {
    return {
      user: this.$store.get('user')
    }
  },
  methods: {
    getDeleteAction () {
      return {
        id: 'block-action',
        label: 'KAccountDZ.BLOCK_ACTION',
        renderer: 'form-button',
        handler: this.onDeleteClicked
      }
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
            await this.$api.getService('users').remove(this.user._id)
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
