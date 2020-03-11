<template>
  <div class="column">
    <div class="row justify-center text-center">
      <div class="q-pa-md">
        <q-icon size="2rem" name="mobile_friendly" />
        <p>{{$t('KAccountDevices.DEVICES_USED')}}</p>
      </div>
    </div>
    <div v-if="items.length > 0" class="row">
      <template v-for="item in items">
        <div class="col-12 col-sm-6 col-md-4 col-lg-3 col-xl-2" :key="item.uuid">
          <k-device-card class="q-pa-sm" :id="item.uuid" :item="item" />
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

<script>
import { mixins } from '../../mixins'

export default {
  name: 'k-account-devices',
  mixins: [
    mixins.baseCollection
  ],
  methods: {
    refreshCollection () {
      this.items = this.$store.get('user.devices', [])
      this.nbTotalItems = this.items.length
      this.$emit('collection-refreshed')
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-device-card'] = this.$load('account/KDeviceCard')
    this.refreshCollection()
    // Whenever the user is updated, update collection as well
    this.$events.$on('user-changed', this.refreshCollection)
  },
  beforeDestroy () {
    this.$events.$off('user-changed', this.refreshCollection)
  }
}
</script>
