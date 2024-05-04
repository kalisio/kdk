<template>
  <div class="column items-center">
    <!-- KDK attribution -->
    <div class="row justify-center items-center">
      <div class="text-caption">
        {{ $t('KSponsor.KDK_POWERED') }}
      </div>
      <KAction
        id="kdk-sponsor"
        icon="las la-external-link-alt"
        tooltip="KSponsor.MORE_ABOUT_KDK"
        size="sm"
        url="https://kalisio.github.io/kdk"
      />
    </div>
    <!-- Kalisio logo -->
    <a href="https://kalisio.com" target="_blank">
      <q-img src="kalisio.png" width="64px">
        <q-tooltip>
          {{ $t('KSponsor.MORE_ABOUT_KALISIO') }}
        </q-tooltip>
      </q-img>
    </a>
  </div>
</template>

<script setup>
import KAction from './KAction.vue'
</script>
