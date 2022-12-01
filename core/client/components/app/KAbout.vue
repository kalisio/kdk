<template>
  <div class="column">
    <!-- Banner -->
    <component :is="computedLogoComponent" />
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
    <!-- Various links -->
    <div class="row justify-center">
      <KAction
        id="app-website"
        icon="las la-info"
        :label="$t('KAbout.MORE_ABOUT_APP', { app: $config('appName') })"
        :url="$config('appWebsite')"
      />
      <KAction
        id="report-bug"
        icon="las la-bug"
        label="KAbout.BUG_REPORT"
        :url="`mailto:${bugReport.address}?subject=${bugReport.subject}&body=${bugReport.body}`"
      />
      <KAction
        id="platform-info"
        icon="las la-desktop"
        label="KAbout.PLATFORM_INFO"
        :dialog="{ title: 'KAbout.PLATFORM_INFO', component: 'app/KPlatform' }"
      />
    </div>
    <!-- Sponsor -->
    <KSponsor class="q-pt-md" />
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

// props
const props = defineProps({
  logoComponent: {
    type: String,
    default: 'app/KLogo'
  }
})

// data
const { clientVersionName, apiVersionName } = useVersion()
const { Platform } = usePlatform()
const bugReport = ref({
  address: 'support@kalisio.com',
  subject: i18n.t('KAbout.BUG_REPORT_SUBJECT', {
    appName: _.get(config, 'appName'),
    clientVersion: clientVersionName.value,
    appVersion: apiVersionName.value
  }),
  body: i18n.t('KAbout.BUG_REPORT_BODY')
})
_.forOwn(Platform.value, (value, key) => { bugReport.value.body += `${key}: ${value}%0D%0A` })
bugReport.value.body += `domain: ${_.get(config, 'domain')}%0D%0A`
bugReport.value.body += `flavor: ${_.get(config, 'flavor')}%0D%0A`

// computed
const computedLogoComponent = computed(() => {
  return loadComponent(props.logoComponent)
})
</script>
