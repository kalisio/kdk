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
import { i18n } from '../../i18n'
import { getPlatform } from '../../utils/utils.platform'
import { actionProps } from '../../utils/utils.actions'
import { useVersion } from '../../composables'
import KAction from './KAction.vue'

// Data
const props = defineProps(_.omit(actionProps, ['toggle', 'url', 'handler', 'route', 'dialog']))
const { clientVersionName, apiVersionName } = useVersion()
const platform = getPlatform()

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
_.forOwn(platform, (value, key) => { bugReport.body += `${key}: ${value}%0D%0A` })
bugReport.body += `domain: ${_.get(config, 'domain')}%0D%0A`
bugReport.body += `flavor: ${_.get(config, 'flavor')}%0D%0A`
const url = ref(`mailto:${bugReport.address}?subject=${bugReport.subject}&body=${bugReport.body}`)
</script>
