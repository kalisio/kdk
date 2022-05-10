<template>
  <div class="column justify-center q-gutter-xs">
    <!--
      Endpoint
    -->
    <div v-if="canChangeEndpoint()" class="row justify-center">
      <small>
        <a id="change-endpoint-link" @click="$router.push({name: 'change-endpoint'})">
          {{$t('KScreen.CHANGE_ENDPOINT_LINK')}}
        </a>
      </small>
    </div>
    <!--
    Version
    -->
    <div class="row justify-center">
      <small v-if="clientVersionName"><cite>{{ $t('KScreen.CLIENT_VERSION') }}{{ clientVersionName }}</cite></small>
      <small v-if="apiVersionName"><cite>&nbsp;-&nbsp;{{ $t('KScreen.API_VERSION') }}{{ apiVersionName }}</cite></small>
    </div>
    <!--
      KDK
    -->
    <div class="row justify-center items-center q-gutter-xs">
      <div>
        <q-icon name="kdk:kdk.png" style="font-size: 1.5rem;" />
      </div>
      <div>
        <small>
          <a @click="onKDKClicked()">
            {{ $t('KScreen.KDK_POWERED') }}
          </a>
        </small>
      </div>
    </div>
  </div>
</template>

<script>
import { openURL, Platform } from 'quasar'
import { version } from '../../mixins'

export default {
  name: 'k-screen-footer',
  mixins: [version],
  methods: {
    canChangeEndpoint () {
      return this.$config('flavor') === 'dev' ? true : Platform.is.cordova
    },
    onPopoverClicked () {
      this.$refs.popover.toggle()
    },
    onKDKClicked () {
      openURL('https://kalisio.github.io/kdk/')
    }
  }
}
</script>
