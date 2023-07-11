<template>
  <q-card class="q-py-sm no-shadow">
    <!-- Sections -->
    <template v-for="section in sections" :key="section.title">
      <q-expansion-item
        :label="$tie(section.title)"
        group="account"        
        class="bg-grey-2"
      >
        <component :is="section.instance" v-bind="section" />
      </q-expansion-item>
    </template>
    <!-- Deletion -->
    <q-expansion-item
      v-if="deletable"
      :label="$t('KAccount.DELETE_ACCOUNT')"
      group="account"
      class="bg-grey-2"
    >
      <div class="q-pa-md row justify-between items-center no-wrap bg-white">
        <span>{{ $t('KAccount.DELETE_ACCOUNT_QUESTION') }}</span>
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
    </q-expansion-item>
  </q-card>
</template>

<script setup>
import _ from 'lodash'
import logger from 'loglevel'
import config from 'config'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Dialog } from 'quasar'
import { Store, i18n, api, utils } from '../..'
import KAction from '../KAction.vue'

// Data
const router = useRouter()
const deletable = ref(true)
const sections = ref([])
const User = Store.get('user')

// Hooks
onMounted(async () => {
  deletable.value = _.get(config, 'account.deletable', true)
  const confSections = _.cloneDeep(_.get(config, 'account.sections', []))
  for (let i = 0; i < confSections.length; ++i) {
    const section = confSections[i]
    section.instance = utils.loadComponent(section.component)
  }
  sections.value = confSections
})

// Function
function onDelete () {
  Dialog.create({
    title: i18n.t('KAccount.DELETE_ACCOUNT_TITLE'),
    message: i18n.t('KAccount.DELETE_ACCOUNT_CONFIRMATION'),
    html: true,
    prompt: {
      model: '',
      type: 'text',
      isValid: val => val === User.name
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
      router.push({ name: 'logout' })
    } catch (error) {
      logger.error(`[KDK] Cannot delete ${User.name} account: ${error}`)
    }
  })
}
</script>
