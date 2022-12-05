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
import { useUser } from '../../composables'

// Data
const { logout } = useUser()
const actions = ref(_.get(config, 'screens.logout.actions', []))

// Immediate
logout()
</script>
