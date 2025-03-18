<template>
  <div class="column">
    <div class="row justify-center">
      <KTimeFilterView />
    </div>
    <div class="row justify-center">
      <KTagsFilterView />
    </div>
  </div>
</template>

<script setup>
import KTimeFilterView from './KTimeFilterView.vue'
import KTagsFilterView from './KTagsFilterView.vue'
</script>
