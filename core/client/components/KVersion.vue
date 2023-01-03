<template>
  <div class="row justify-center items-center q-gutter-x-sm">
    <q-badge
      :label="$t('KVersion.CLIENT_VERSION', { version: clientVersionName })"
      color="primary"
    />
    <q-badge
      :label="$t('KVersion.API_VERSION', { version: apiVersionName })"
      color="primary"
    />
  </div>
</template>

<script setup>
import { useVersion } from '../composables'

// Data
const { clientVersionName, apiVersionName } = useVersion()
</script>
