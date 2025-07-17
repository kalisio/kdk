<template>
  <KItem
    v-bind="$props"
    :actions="userScopeActions"
    :dense="dense"
  >
    <template v-slot:item-content>
      <q-item-label>
        <q-chip :style="'background-color: ' + color" :text-color="textColor">
          {{ name }}
        </q-chip>
        <span v-if="inline" class="text-grey-8 q-ml-md" v-html="description"></span>
      </q-item-label>
      <q-item-label v-if="!inline" caption lines="2">
        <span v-html="description" />
      </q-item-label>
    </template>
  </KItem>
</template>

<script>
import { mixins as kdkCoreMixins } from '../../'
import { getColorFromPalette, getContrastColor } from '../../utils/utils.colors.js'
import KItem from '../collection/KItem.vue'

export default {
  mixins: [kdkCoreMixins.baseItem],
  components: {
    KItem
  },
  props: {
    dense: {
      type: Boolean,
      default: true
    },
    inline: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    color () {
      return this.item.color || 'primary'
    },
    textColor () {
      return getContrastColor(getColorFromPalette(this.color))
    },
    userScopeActions () {
      return this.item.scope === 'user' ? this.itemActions : []
    }
  }
}
</script>
