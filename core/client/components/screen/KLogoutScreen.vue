<template>
  <KScreen
    title="KLogoutScreen.TITLE"
    :actions="actions"
  />
</template>

<script setup>
import _ from 'lodash'
import config from 'config'
import { ref } from 'vue'
import KScreen from './KScreen.vue'
import { logout } from '../../utils/utils.session.js'

// Data
const actions = ref(_.get(config, 'screens.logout.actions', []))

// Immediate
logout()
</script>
