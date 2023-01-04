<template>
  <div class="q-pa-md">
    <KMarkdownViewer :url="url" />
  </div>
</template>

<script setup>
import _ from 'lodash'
import config from 'config'
import { ref } from 'vue'
import { getAppLocale } from '../../utils.js'
import KMarkdownViewer from '../media/KMarkdownViewer.vue'

// Data
const appName = _.get(config, 'appName')
const terms = _.get(config, 'terms', _.toLower(appName) + '-terms')
const locale = getAppLocale()
const url = ref(`${terms}_${locale}.md`)
</script>

<style lang="scss">
// override headers size
h1 {
  font-size: 2.5rem;
}
h2 {
  font-size: 2rem;
}
h3 {
  font-size: 1.5rem;
}
h4 {
  font-size: 1.4rem;
}
h5 {
  font-size: 1.3rem;
}
h6 {
  font-size: 1.2rem;
}
</style>
