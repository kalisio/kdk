<template>
  <div v-if="User" class="column content-center q-pa-sm q-gutter-y-sm bg-grey-4">
    <!--
      User avatar
    -->
    <div class="row justify-center">
      <KAvatar
        :object="User"
        size="8rem"
      />
    </div>
    <!--
      User information
    -->
    <div class="row justify-center items-center">
      <span class="text-subtitle1">{{ User.name }}</span>
      <KAction
        id="manage-account"
        icon="las la-user-cog"
        :tooltip="$t('KIdentityPanel.MANAGE')"
        :route="{ name: 'account-activity', params: { page: 'profile' } }"
        @triggered="$emit('triggered', arguments)"
      />
    </div>
  </div>
</template>

<script setup>
import { useUser } from '../../composables'
import KAction from '../KAction.vue'
import KAvatar from '../KAvatar.vue'

// Data
const { User } = useUser()
</script>
