<template>
  <div class="q-pa-sm column justify-center q-gutter-sm">
    <!-- Version -->
    <KVersion />
    <!-- Endpoint -->
    <div v-if="canChangeEndpoint" class="row justify-center">
      <KAction
        class="text-caption"
        id="change-endpoint"
        label="KScreen.CHANGE_ENDPOINT_LINK"
        :route="{name: 'change-endpoint'}"
      />
    </div>
    <!-- Install App -->
    <KInstallApp />
    <!-- Sponsor -->
    <KSponsor />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { useVersion } from '../../composables'
import KVersion from '../KVersion.vue'
import KAction from '../KAction.vue'
import KSponsor from '../KSponsor.vue'
import KInstallApp from '../KInstallApp.vue'

// Data
const $q = useQuasar()
const { Version } = useVersion()
const canChangeEndpoint = ref(false)
if (Version.value.flavor === 'dev' || $q.platform.is.cordova) canChangeEndpoint.value = true
</script>
