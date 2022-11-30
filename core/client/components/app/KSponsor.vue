<template>
  <div class="column items-center">
    <KAction
      id="kdk-sponsor"
      label="KSponsor.KDK_POWERED"
      url="https://kalisio.github.io/kdk"
    />
    <!-- Kalisio logo -->
    <a href="https://kalisio.com" target="_blank">
      <q-img src="kalisio.png" :width="logoWidth">
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

// data
const $q = useQuasar()

// computed
const logoWidth = computed(() => {
  if($q.screen.lt.sm) return '72px'
  return '96px'
})
</script>
