<template>
  <KItem
    v-bind="$props"
    :actions="itemActions"
    :dense="dense"
  >
    <template v-slot:item-content>
      <div
        class="row items-center no-wrap"
        :class="{ 'q-gutter-x-sm': dense, 'q-gutter-x-md': !dense }"
      >
        <div class="text-subtitle2">
          {{ name }}
        </div>
        <div
          class="row item-baseline no-wrap"
          :class="{ 'q-gutter-x-sm': dense, 'q-gutter-x-md': !dense }"
        >
          <KStylePreview :style="pointStyle" type="point" />
          <KStylePreview :style="lineStyle" type="line" />
          <KStylePreview :style="polygonStyle" type="polygon" />
        </div>
      </div>
    </template>
  </KItem>
</template>

<script>
import { mixins as kdkCoreMixins } from '../../../../core/client'
import KItem from '../../../../core/client/components/collection/KItem.vue'
import KStylePreview from './KStylePreview.vue'

export default {
  mixins: [kdkCoreMixins.baseItem],
  components: {
    KItem,
    KStylePreview
  },
  props: {
    dense: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    name () {
      return this.item.name
    },
    pointStyle () {
      return this.item.point
    },
    lineStyle () {
      return this.item.line
    },
    polygonStyle () {
      return this.item.polygon
    }
  },
  methods: {
    hasUserScope () {
      return this.item.scope === 'user'
    },
    hasSystemScope () {
      return this.item.scope === 'system'
    }
  }
}
</script>
