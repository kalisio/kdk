<template>
  <div class="column items-center">
    <KAction
      id="kdk-sponsor"
      label="KSponsor.KDK_POWERED"
      url="https://kalisio.github.io/kdk"
    />
    <!-- Kalisio logo -->
    <a href="https://kalisio.com" target="_blank">
      <q-img src="kalisio.png" width="96px">
        <q-tooltip>
          {{ $t('KSponsor.MORE_ABOUT_KALISIO') }}
        </q-tooltip>
      </q-img>
    </a>
  </div>
</template>

<script setup>
</script>
