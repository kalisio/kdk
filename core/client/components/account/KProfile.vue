<template>
  <div v-if="User" class="full-width column">
    <!-- Header -->
    <component v-if="hasHeader" :is="computedHeaderComponent" class="q-py-sm full-width justify-end no-wrap" />
    <!-- Avatar -->
    <div v-if="avatar && userAvatar" class="q-py-sm column items-center">
      <KAvatar
        :subject="userAvatar"
        size="5rem"
      />
    </div>
    <!-- Information -->
    <div class="q-py-sm column items-center">
      <div class="text-subtitle1 text-weight-medium">
        {{ userName }}
      </div>
      <div v-if="description && userDescription" class="text-caption">
        {{ userDescription }}
      </div>
    </div>
    <!-- Role -->
    <div v-if="role && userRole" class="q-py-sm column items-center">
      <KChip
        color="primary"
        text-color="white"
        square
        size=".85rem"
        :label="$t(`roles.${userRole}`)"
      />
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'
import { useUser } from '../../composables'
import { loadComponent } from '../../utils/index.js'
import config from 'config'
import KAvatar from '../KAvatar.vue'
import KChip from '../KChip.vue'

// Props
defineProps({
  avatar: {
    type: Boolean,
    default: true
  },
  description: {
    type: Boolean,
    default: true
  },
  role: {
    type: Boolean,
    default: true
  }
})

// Data
const { User, name: userName, description: userDescription, avatar: userAvatar, role: userRole } = useUser()
const headerComponent = _.get(config, 'profile.header')
const hasHeader = !_.isNil(headerComponent)

// Computed
const computedHeaderComponent = computed(() => {
  return loadComponent(headerComponent)
})
</script>
