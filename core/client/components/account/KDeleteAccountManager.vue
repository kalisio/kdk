<template>
  <div class="q-pa-md row justify-between items-center no-wrap bg-white">
    <span>{{ $t('KDeleteAccountManager.QUESTION') }}</span>
    <KAction
      id="delete-account"
      label="DELETE"
      color="negative"
      renderer= 'form-button'
      outline
      :closePopup="true"
      :handler="onDelete"
    />
  </div>
</template>

<script setup>
import _ from 'lodash'
import { useRouter } from 'vue-router'
import { Dialog } from 'quasar'
import { Store, i18n, api } from '../..'
import KAction from '../action/KAction.vue'

// Data
const router = useRouter()
const User = Store.get('user')

// Function
async function onDelete () {
  const name = _.get(User, 'profile.name')
  Dialog.create({
    title: i18n.t('KDeleteAccountManager.CONFIRMATION_TITLE'),
    message: i18n.t('KDeleteAccountManager.CONFIRMATION'),
    html: true,
    prompt: {
      model: '',
      type: 'text',
      isValid: val => val === name
    },
    persistent: true,
    ok: {
      label: i18n.t('OK'),
      flat: true
    },
    cancel: {
      label: i18n.t('CANCEL'),
      flat: true
    }
  }).onOk(async (data) => {
    try {
      await api.getService('users').remove(User._id)
      // Redirecting to logut will logut the user but logout an inexsiting user will raise an error
      // We prefer to clean the token manually instead
      // router.push({ name: 'logout' })
      Store.set('user', null)
      await api.authentication.removeAccessToken()
      router.push({ name: 'login' })
    } catch (error) {
      throw new Error(`[KDK] Cannot delete ${name} account: ${error}`)
    }
  })
}
</script>
