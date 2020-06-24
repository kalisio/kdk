<template>
  <div>
    <q-list>
      <q-separator />
      <!--
        About link
      -->
      <q-item id="about" clickable @click="onAbout">
        <q-item-section avatar>
          <q-icon name="las la-info" />
        </q-item-section>
        <q-item-section>
          <q-item-label>
            {{ $t('KAbout.SIDENAV') }}
          </q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <!--
      About window
     -->
    <k-modal :title="$t('KAbout.TITLE')" :toolbar="getToolbar()" id="about" ref="about">
      <div slot="modal-content">
        <div class="column justify-center">
          <!-- Banner -->
          <div v-if="banner" class="row justify-center"><img class="screen-banner" :src="banner"></div>
          <!-- Version -->
          <div id="version-numbers" class="row justify-center">
            <cite v-if="clientVersionName">{{ $t('KAbout.CLIENT_VERSION') }}{{ clientVersionName }}</cite>
            <cite v-if="apiVersionName">&nbsp;-&nbsp;{{ $t('KAbout.API_VERSION') }}{{ apiVersionName }}</cite>
          </div>
          <div id="hosting" class="row justify-center">
            <cite>{{ $t('KAbout.DOMAIN') }} <a :href="$config('domain')" target="_blank">{{ $config('domain') }}</a></cite>
            <cite>&nbsp;({{ $config('flavor') }})</cite>
          </div><br/>
          <!-- More info -->
          <div class="row justify-center">
            <a id="app-website" :href="$config('appWebsite')" target="_blank">
              <q-icon name="las la-external-link-alt"/>&nbsp;{{ $t('KAbout.MORE') }} {{ $config('appName') }}
            </a>
          </div><br/>
          <div class="row justify-center">
            <a id="publisher-website" :href="$config('publisherWebsite')" target="_blank">
              <q-icon name="las la-external-link-alt"/>&nbsp;{{ $t('KAbout.MORE_PUBLISHER') }} {{ $config('publisher') }}
            </a>
          </div><br/>
          <!-- Bug report -->
          <div class="row justify-center">
            <a id="report-bug" :href="`mailto:${bugReport.address}?subject=${bugReport.subject}&body=${bugReport.body}`">
              <q-icon name="las la-envelope"/>&nbsp;{{ $t('KAbout.BUG_REPORT') }}
            </a>
          </div><br/>
          <!-- System -->
          <div class="row justify-center" @click="showSystemDetails = !showSystemDetails">
            <a id="system-details" >
              <q-icon name="las la-laptop-code"/>&nbsp;{{ $t('KAbout.SYSTEM_DETAILS') }}
            </a>
          </div>
          <br/>
          <div v-show="showSystemDetails">
            <template v-for="(value, key) in systemDetails">
              <div :key="key" class="row justify-center">
                <cite><strong>{{ key }}</strong>: {{ value }}</cite>
              </div>
            </template>
          </div>
          <br/>
          <!-- KDK -->
          <div class="row justify-center">
            <img :src="$load('kdk-icon.png', 'asset')" width="20" height="20" />
            <a href="https://kalisio.github.io/kdk" target="_blank">{{ $t('KAbout.KDK_POWERED') }}</a>
          </div>
        </div>
      </div>
    </k-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import mixins from '../../mixins'

export default {
  name: 'k-about',
  mixins: [mixins.version],
  data () {
    return {
      systemDetails: {},
      showSystemDetails: false,
      bugReport: {}
    }
  },
  methods: {
    getToolbar () {
      return [
        { name: 'close-action', label: this.$t('KAbout.CLOSE_ACTION'), icon: 'las la-times', handler: () => this.onAboutClosed() }
      ]
    },
    onAbout () {
      this.$refs.about.open()
    },
    onAboutClosed () {
      this.$refs.about.close()
      this.$store.patch('leftDrawer', { visible: false })
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    // Configure this screen
    this.banner = this.$load(this.$config('screens.banner', 'kalisio-banner.png'), 'asset')
    Object.assign(this.systemDetails, this.$q.platform.is)
    Object.assign(this.systemDetails, { touch: this.$q.platform.has.touch })
    Object.assign(this.systemDetails, { iframe: this.$q.platform.within.iframe })
    Object.assign(this.systemDetails, { agent: this.$q.platform.userAgent })
    const context = {
      appName: this.$config('appName'),
      clientVersionName: this.clientVersionName,
      apiVersionName: this.apiVersionName
    }
    this.bugReport.address = 'support@kalisio.com'
    this.bugReport.subject = this.$t('KAbout.BUG_REPORT_SUBJECT', context)
    this.bugReport.body = this.$t('KAbout.BUG_REPORT_BODY')
    // Append detailed system info to email body
    _.forOwn(this.systemDetails, (value, key) => { this.bugReport.body += `${key}: ${value}%0D%0A` })
    this.bugReport.body += `domain: ${this.$config('domain')}%0D%0A`
    this.bugReport.body += `flavor: ${this.$config('flavor')}%0D%0A`
  }
}
</script>
