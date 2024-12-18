<template>
  <KScreen
    :actions="actions"
  />
</template>

<script setup>
import _ from 'lodash'
import config from 'config'
import { ref } from 'vue'
import KScreen from './KScreen.vue'

// Data
const actions = ref(_.get(config, 'screens.login.actions', []))
</script>
