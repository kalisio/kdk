<template>
  <KScreen
    :title="message"
    :actions="actions"
  />
</template>

<script setup>
import _ from 'lodash'
import config from 'config'
import KScreen from './KScreen.vue'

// Data
const message = _.get(config, 'screens.notAuthorized.message', 'KUnauthorizedScreen.MESSAGE')
const actions = _.get(config, 'screens.error.actions', [])
</script>
