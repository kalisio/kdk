<template>
  <div
    class="relative-position q-pl-md row full-width items-center no-wrap cursor-pointer"
    v-ripple:primary
  >
    <!-- View name -->
    <div class="ellipsis full-width" @click="$emit('item-selected', item, 'apply-view')">
      {{ item.name }}
      <q-tooltip
        v-if="(item.description) && $q.platform.is.desktop" :delay="500"
        anchor="center left"
        self="center right"
        :offset="[20, 0]">
        {{ item.description }}
      </q-tooltip>
      <q-space />
    </div>
    <!-- View favorite action -->
    <KAction
      id="set-home-view"
      icon="las la-star"
      :color="item.isDefault ? 'primary' : 'grey-5'"
      :tooltip="$t('KViewsPanel.SET_HOME_VIEW')"
      :propagate="false"
      @views-status-changed="refreshViews"
      @triggered="$emit('item-selected', item, 'set-home-view')" />
    <!-- View actions -->
    <KPanel
      :id="`${item.name}-actions`"
      :content="viewActions"
      :context="item" />
  </div>
</template>

<script>
import localforage from 'localforage'
import { KPanel, KAction } from '../../../../core/client/components'
import { baseItem } from '../../../../core/client/mixins'

export default {
  name: 'k-view-selector',
  components: {
    KPanel,
    KAction
  },
  emits: ['views-status-changed'],
  mixins: [baseItem],
  async setup () {
    const cachedViews = await localforage.getItem('views')
    return {
      cachedViews
    }
  },
  computed: {
    viewActions () {
      let itemActions = _.cloneDeep(this.itemActions)
      let viewActions = _.get(itemActions, '[0].content', [])
      if (this.cachedViews && this.cachedViews[this.item._id]) {
        viewActions.push({
          id: 'uncache-view',
          icon: 'wifi',
          label: 'KViewsPanel.UNCACHE_VIEW',
          handler: (item) => this.$emit('item-selected', item, 'uncache-view')
        })
      } else {
        viewActions.push({
          id: 'cache-view',
          icon: 'wifi_off',
          label: 'KViewsPanel.CACHE_VIEW',
          handler: (item) => this.$emit('item-selected', item, 'cache-view')
        })
      }
      this.$emit('views-status-changed')
      return itemActions
    }
  },
  methods: {
    async refreshViews() {
      const cachedViews = await localforage.getItem('views')
      return cachedViews
    }
  }
}

</script>
