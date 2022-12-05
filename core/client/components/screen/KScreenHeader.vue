<template>
  <div class="q-pa-sm row justify-center">
    {{ flavor }}
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { i18n } from '../../i18n.js'
import { useVersion } from '../../composables'

// Data
const { Version } = useVersion()
const flavor = ref('')
if (Version.value.flavor === 'dev') flavor.value = i18n.t('KScreen.DEVELOPMENT_VERSION')
if (Version.value.flavor === 'test') flavor.value = i18n.t('KScreen.TEST_VERSION')
</script>
