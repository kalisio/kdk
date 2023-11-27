<template>
  <div
    class="relative-position q-pl-md row full-width items-center no-wrap cursor-pointer"
    v-ripple:primary
  >
    <!-- Project name -->
    <div class="ellipsis full-width" @click="$emit('item-selected', item, 'open-project')">
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
    <!-- Project actions -->
    <KPanel
      :id="`${item.name}-actions`"
      :content="itemActions"
      :context="item" />
  </div>
</template>

<script>
import { KPanel, KAction } from '../../../../core/client/components'
import { baseItem } from '../../../../core/client/mixins'

export default {
  name: 'k-project-selector',
  components: {
    KPanel,
    KAction
  },
  mixins: [baseItem]
}
</script>
