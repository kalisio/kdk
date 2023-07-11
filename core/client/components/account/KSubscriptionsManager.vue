<template>
  <div class="column">
    <div v-if="subscriptions.length > 0">
      <q-list>
        <template v-for="subscription in subscriptions" :key="subscription.endpoint">
          <KSubscription 
            :subscription="subscription"
            :actions="actions"
          /> 
        </template>
      </q-list>
    </div>
    <div v-else class="row col justify-center">
      <KStamp
        icon="las la-exclamation-circle"
        icon-size="1.6rem"
        :text="$t('KList.EMPTY_LIST')"
        direction="horizontal" 
      />
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'
import { Store } from '../../store.js'
import KSubscription from './KSubscription.vue'
import KStamp from '../KStamp.vue'

// Props
defineProps({
  actions: {
    type: Array,
    default: () => []
  }
})

// Data
const User = Store.get('user')

// Computed
const subscriptions = computed(() => {
  return User.subscriptions
})
</script>
