<template>
  <div
    class="relative-position q-pl-md full-width row items-center no-wrap cursor-pointer"
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
    <k-action
      id="set-home-view"
      icon="las la-star"
      :color="item.isDefault ? 'primary' : 'grey-5'"
      :tooltip="$t('KViewsPanel.SET_HOME_VIEW')"
      :propagate="false"
      @triggered="$emit('item-selected', item, 'set-home-view')" />
    <!-- View actions -->
    <k-panel
      :id="`${item.name}-actions`"
      :content="itemActions"
      :context="item" />
  </div>
</template>

<script>
import { KAvatar, KPanel, KAction } from '../../../../core/client/components'
import { baseItem } from '../../../../core/client/mixins'

export default {
  name: 'k-view-selector',
  components: {
    KAvatar,
    KPanel,
    KAction
  },
  mixins: [baseItem]
}
</script>
