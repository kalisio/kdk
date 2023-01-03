<template>
  <div class="column items-center">
    <div class="row justify-center items-center">
      <div>
        {{ $t('KSponsor.KDK_POWERED') }}
      </div>
      <KAction
        id="kdk-sponsor"
        icon="las la-external-link-alt"
        tooltip="KSponsor.MORE_ABOUT_KDK"
        size="xs"
        url="https://kalisio.github.io/kdk"
      />
    </div>
    <!-- Kalisio logo -->
    <a href="https://kalisio.com" target="_blank">
      <q-img src="kalisio.png" :width="computedLogoWidth">
        <q-tooltip>
          {{ $t('KSponsor.MORE_ABOUT_KALISIO') }}
        </q-tooltip>
      </q-img>
    </a>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'

// Data
const $q = useQuasar()

// Computed
const computedLogoWidth = computed(() => {
  if ($q.screen.lt.sm) return '64px'
  return '72px'
})
</script>
