<template>
  <KScreen v-if="!provider"
    title="KLogoutScreen.TITLE"
    :actions="actions"
  />
</template>

<script setup>
import _ from 'lodash'
import config from 'config'
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import KScreen from './KScreen.vue'
import { logout } from '../../utils/utils.session.js'
import { Store } from '../../store.js'

// Data
const route = useRoute()
const actions = ref(_.get(config, 'screens.logout.actions', []))
// When called with a prameter this means we should logout from the OAuth provider as well
// In this case we do not show the logout screen as the OAuth provider has its own
const provider = ref(route.params.provider)
  
// Hooks
onMounted(async () => {
  await logout()
  // When called with a prameter this means we should logout from the OAuth provider as well
  if (provider.value) {
    location.href = `oauth-logout/${provider.value}`
  }
})
</script>
