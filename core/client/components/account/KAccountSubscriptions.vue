<template>
  <div class="column">
    <div class="row justify-center text-center">
      <div class="q-pa-md">
        <q-icon size="2rem" name="mobile_friendly" />
        <p>{{$t('KAccountSubscriptions.SUBSCRIPTIONS')}}</p>
      </div>
    </div>
    <div v-if="items.length > 0" class="row">
      <template v-for="item in items" :key="item.endpoint">
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2">
          <KSubscriptionCard class="q-pa-sm" :id="item.endpoint" :item="item" v-bind="renderer" />
        </div>
      </template>
    </div>
    <div v-else class="row justify-center text-center">
      <div class="q-ma-xl">
        <q-icon size="3rem" name="error_outline" />
        <p>{{$t('KGrid.EMPTY_GRID')}}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onBeforeUnmount } from 'vue'
import { Events } from '../../events.js'
import KSubscriptionCard from './KSubscriptionCard.vue'
import { Store } from '../../store.js'

// Props
defineProps({
  renderer: {
    type: Object,
    default: () => ({ component: 'account/KSubscriptionCard' })
  }
})

// Data
const items = ref([])

// Functions
function refreshCollection () {
  items.value = Store.get('user.subscriptions', [])
}

// Lifecycle hooks
onBeforeMount(() => {
  refreshCollection()
  // Whenever the user abilities are updated, update collection as well
  Events.on('user-changed', refreshCollection)
})

// Cleanup for appendItems
onBeforeUnmount(() => {
  Events.off('user-changed', refreshCollection)
})
</script>
