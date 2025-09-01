<template>
  <div v-if="User">
    <KLayout />
  </div>
</template>

<script setup>
import KLayout from '../layout/KLayout.vue'
import { useUser } from '../../composables'

// Data
const { User } = useUser()
</script>
