<template>
  <q-card class="q-py-sm no-shadow">
    <!-- Sections -->
    <template v-for="section in sections" :key="section.title">
      <q-expansion-item
        :label="$tie(section.title)"
        class="bg-grey-2"
      >
        <component :is="section.instance" />
      </q-expansion-item>
    </template>
    <!-- Deletion -->
    <q-expansion-item
      v-if="deletable"
      :label="$t('KAccount.DELETE_ACCOUNT')"
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
          :handler="onDelete"
        />
      </div>
    </q-expansion-item>
  </q-card>
</template>

<script setup>
import _ from 'lodash'
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
  console.log(User)
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
    message: i18n.t('KAccount.DELETE_ACCOUNT_CONFIRMATION'),
    html: true,
    prompt: {
      type: 'text',
      model: ''
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
    if (data === User.name) {
      try {
        await api.getService('users').remove(User._id)
      } catch (error) {
        // do not logout
        return
      }
      router.push({ name: 'logout' })
    }
  })
}
</script>
