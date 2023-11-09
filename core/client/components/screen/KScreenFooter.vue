<template>
  <div class="q-pa-sm column justify-center q-gutter-sm">
    <!-- Version -->
    <KVersion />
    <!-- Sponsor -->
    <KSponsor />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useVersion } from '../../composables'
import KVersion from '../KVersion.vue'
import KAction from '../KAction.vue'
import KSponsor from '../KSponsor.vue'

// Data
const { Version } = useVersion()
</script>
