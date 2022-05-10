<template>
  <div class="q-pa-sm column justify-center q-gutter-sm">
    <!--
      Version
    -->
    <div class="row justify-center q-gutter-x-sm">
      <q-badge 
        v-if="clientVersionName" 
        :label="$t('KScreen.CLIENT_VERSION') + clientVersionName"
        color="primary"
        align="middle"
        outline
      />
      <div>-</div>
      <q-badge 
        v-if="apiVersionName"
        :label="$t('KScreen.API_VERSION') + apiVersionName"
        color="primary"
        align="middle"
        outline
      />
    </div>
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
      KDK
    -->
    <div class="row justify-center items-center q-gutter-xs">
      <div>
        <q-icon name="kdk:kdk.png" style="font-size: 1.6rem;" />
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
    onKDKClicked () {
      openURL('https://kalisio.github.io/kdk/')
    }
  }
}
</script>
