<template>
  <KItem
    v-bind="$props"
    :actions="itemActions"
    :dense="dense"
    class="items-center"
  >
    <template v-slot:item-content>
      <div
        class="row items-center no-wrap"
        :class="{ 'q-gutter-x-sm': dense, 'q-gutter-x-md': !dense }"
      >
        <div class="text-subtitle2">
          <div>
            {{ name }}
          </div>
          <div>
            <span v-for="tag in tags">
              <q-badge class="q-mx-xs" :style="'background-color: ' + tag.color" :text-color="getTextColor(tag)">{{ tag.name }}</q-badge>
            </span>
          </div>
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
import { getContrastColor } from '../../../../core/client/utils/utils.colors.js'
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
    tags () {
      return this.item.tags || []
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
    },
    getTextColor (tag) {
      return getContrastColor(tag.color ? tag.color : 'white')
    }
  }
}
</script>
