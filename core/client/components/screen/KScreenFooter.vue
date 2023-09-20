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

// Data
const { Version } = useVersion()
const canChangeEndpoint = ref(false)
if (Version.value.flavor === 'dev') canChangeEndpoint.value = true
</script>
