<template>
  <KAction
    v-bind="props"
    :url="url"
  />
</template>

<script setup>
import _ from 'lodash'
import config from 'config'
import { ref } from 'vue'
import { i18n } from '../../i18n.js'
import { Platform } from '../../platform.js'
import { actionProps } from '../../utils/utils.actions.js'
import { useVersion } from '../../composables'
import KAction from './KAction.vue'

// Props
const props = defineProps(_.omit(actionProps, ['toggle', 'url', 'handler', 'route', 'dialog']))

// Data
const { clientVersionName, apiVersionName } = useVersion()

// Setup bug report info
const bugReport = {
  address: _.get(config, 'publisherContact'),
  subject: i18n.t('KAbout.BUG_REPORT_SUBJECT', {
    appName: _.get(config, 'appName'),
    clientVersion: clientVersionName.value,
    apiVersion: apiVersionName.value
  }),
  body: i18n.t('KAbout.BUG_REPORT_BODY')
}
bugReport.body += `domain: ${_.get(config, 'domain')}%0D%0A`
bugReport.body += `flavor: ${_.get(config, 'flavor')}%0D%0A`
bugReport.body += JSON.stringify(Platform.getData(), null, 2)
const url = ref(`mailto:${bugReport.address}?subject=${bugReport.subject}&body=${bugReport.body}`)
</script>
