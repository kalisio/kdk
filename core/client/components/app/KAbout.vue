<template>
  <div class="column">
    <!-- Banner -->
    <div class="row justify-center">
      <component :is="logoComponent" />
    </div>
    <!-- Version -->
    <KVersion class="q-pa-sm" />
    <!-- Endpoint -->
    <div class="row justify-center">
      <cite>{{ $t('KAbout.DOMAIN') }}
        <a :href="$config('domain')" target="_blank">{{ $config('domain') }}</a>
      </cite>
      <cite>
        &nbsp;({{ $config('flavor') }})
      </cite>
    </div>
    <!-- separator -->
    <div class="q-py-md">
      <q-separator />
    </div>
    <!-- Actions -->
    <KPanel
      id="actions"
      :content="actions"
      class="justify-center"
    />
    <!-- Sponsor -->
    <KSponsor class="q-pt-lg" />
  </div>
</template>

<script setup>
import _ from 'lodash'
import config from 'config'
import { ref } from 'vue'
import { i18n } from '../../i18n'
import { loadComponent } from '../../utils'
import { getPlatform } from '../../utils/utils.platform'
import { useVersion } from '../../composables'
import KVersion from '../KVersion.vue'
import KSponsor from '../KSponsor.vue'
import KPanel from '../KPanel.vue'

// Data
const { clientVersionName, apiVersionName } = useVersion()
const platform = getPlatform()
// logo component
const logoComponent = ref(loadComponent(_.get(config, 'logoComponent', 'KLogo')))
// bug report
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
// actions
const defaultActions = [
  {
    id: 'report-bug',
    icon: 'las la-bug',
    label: 'KAbout.BUG_REPORT',
    stack: true,
    url: `mailto:${bugReport.address}?subject=${bugReport.subject}&body=${bugReport.body}`
  }, {
    id: 'platform-info',
    icon: 'las la-desktop',
    label: 'KAbout.PLATFORM_INFO',
    stack: true,
    dialog: {
      title: 'KAbout.PLATFORM_INFO',
      component: 'app/KPlatform',
      okAction: 'CLOSE',
      widthPolicy: 'narrow'
    }
  }
]
const actions = ref(_.get(config, 'about.actions', defaultActions))
</script>
