<template>
  <div v-if="User">
    <KLayout />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import KLayout from '../layout/KLayout.vue'
import { Store } from '../../store.js'

const User = Store.getRef('user')
</script>
