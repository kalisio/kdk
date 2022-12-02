<template>
  <div class="column">
    <!-- Banner -->
    <div class="row justify-center">
      <component :is="computedLogoComponent" />
    </div>
    <!-- Version -->
    <KVersion class="q-pa-sm" />
    <!-- Endpoint -->
    <div class="row justify-center">
      <cite>{{ $t('KAbout.DOMAIN') }} <a :href="$config('domain')" target="_blank">{{ $config('domain') }}</a></cite>
      <cite>&nbsp;({{ $config('flavor') }})</cite>
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
import { ref, computed } from 'vue'
import { i18n } from '../../i18n'
import { loadComponent } from '../../utils'
import { useVersion, usePlatform } from '../../composables'
import KVersion from './KVersion.vue'
import KSponsor from './KSponsor.vue'
import KPanel from '../frame/KPanel.vue'

// data
const { clientVersionName, apiVersionName } = useVersion()
const { Platform } = usePlatform()
// bug report
const bugReport = {
  address: _.get(config, 'publisherContact'),
  subject: i18n.t('KAbout.BUG_REPORT_SUBJECT', {
    appName: _.get(config, 'appName'),
    clientVersion: clientVersionName.value,
    appVersion: apiVersionName.value
  }),
  body: i18n.t('KAbout.BUG_REPORT_BODY')
}
_.forOwn(Platform.value, (value, key) => { bugReport.body += `${key}: ${value}%0D%0A` })
bugReport.body += `domain: ${_.get(config, 'domain')}%0D%0A`
bugReport.body += `flavor: ${_.get(config, 'flavor')}%0D%0A`
// logo component
const logoComponent = ref(_.get(config, 'logoComponent', 'app/KLogo'))
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
    dialog: { title: 'KAbout.PLATFORM_INFO', component: 'app/KPlatform', okAction: 'CLOSE' } 
  }
]
console.log(defaultActions)
const actions = ref(_.get(config, 'about.actions', defaultActions))

// computed
const computedLogoComponent = computed(() => {
  return loadComponent(logoComponent.value)
})
</script>
