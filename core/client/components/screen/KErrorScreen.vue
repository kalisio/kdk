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
const message = _.get(config, 'screens.error.message', 'KErrorScreen.MESSAGE')
const defaultActions = [{
  id: 'go-home-action',
  icon: 'las la-home',
  label: 'KErrorScreen.GO_HOME_LABEL',
  renderer: 'form-button',
  route: { name: 'index' }
}]
const actions = _.get(config, 'screens.error.actions', defaultActions)
</script>
