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
