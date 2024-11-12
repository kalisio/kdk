<template>
  <div
    v-ripple:primary
    class="k-view-selector"
  >
    <div class="q-pl-md row full-width items-center no-wrap">
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
        @triggered="$emit('item-selected', item, 'set-home-view')" />
      <!-- View actions -->
      <KPanel
        :id="`${item.name}-actions`"
        :content="cachable ? viewActions : itemActions"
        :context="item" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { KPanel, KAction } from '../../../../core/client/components'
import { baseItem } from '../../../../core/client/mixins'

export default {
  name: 'k-view-selector',
  components: {
    KPanel,
    KAction
  },
  mixins: [baseItem],
  props: {
    cachable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    viewActions () {
      const itemActions = _.cloneDeep(this.itemActions)
      const viewActions = _.get(itemActions, '[0].content', [])
      if (this.item.isCached) {
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
      return itemActions
    }
  }
}

</script>

<style lang="scss" scoped>
.k-view-selector {
  position: relative; // needed for the directive v-ripple to target the item
  cursor: pointer;
}
.k-view-selector:hover {
  background-color: #efefef
}
</style>
