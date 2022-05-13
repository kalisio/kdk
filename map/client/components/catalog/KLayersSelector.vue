<template>
  <div>
    <slot name="header" />
    <div v-if="layers.length > 0">
      <template v-for="layer in layers" :key="getId(layer)">
        <div :id="getId(layer)" class="full-width row items-center q-pl-md q-pr-sm no-wrap">
          <!-- Layer name -->
          <div class="ellipsis" v-bind:class="{
            'text-primary text-weight-bold': layer.isVisible,
            'text-grey-6': layer.isDisabled
          }">
            {{ layer.label || layer.name }}
            <q-badge v-if="layer.badge" v-bind="layer.badge">
              <q-icon v-if="layer.badge.icon" v-bind="layer.badge.icon" />
            </q-badge>
            <q-tooltip
              v-if="(layer.tooltip || layer.description) && $q.platform.is.desktop" :delay="1000"
              anchor="center left"
              self="center right"
              :offset="[20, 0]">
              {{ layer.tooltip || layer.description }}
            </q-tooltip>
          </div>
          <q-space />
          <q-icon name="las la-exclamation-circle" size="sm" color="warning" v-if="layer.isDisabled">
            <q-tooltip>{{ $t('KLayersSelector.LAYER_DISABLED') }}</q-tooltip>
          </q-icon>
          <!-- Layer toggle -->
          <q-toggle :value="layer.isVisible" :disable="layer.isDisabled" size="sm" @input="onLayerClicked(layer)" />
          <!-- Layer actions -->
          <k-panel
            :id="`${layer.name}-actions`"
            :content="layer.actions"
            :context="layer"
            :filter="{ id: { $nin: ['toggle'] } }"
            action-renderer="item" />
        </div>
      </template>
    </div>
    <div v-else-if="!options.hideIfEmpty" class="row justify-center q-pa-sm">
      <k-stamp icon="las la-exclamation-circle" icon-size="sm" :text="$t('KLayersSelector.NO_LAYER_AVAILABLE')" direction="horizontal" />
    </div>
    <slot name="footer" />
  </div>
</template>

<script>
import _ from 'lodash'
import { QToggle } from 'quasar'
import { utils } from '../../../../core/client'
import { KStamp, KPanel } from '../../../../core/client/components'

export default {
  name: 'k-layers-selector',
  components: {
    QToggle,
    KStamp,
    KPanel
  },
  props: {
    layers: {
      type: Array,
      default: () => []
    },
    options: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    getId (layer) {
      const name = _.kebabCase(layer.name)
      if (_.startsWith(name, 'layers-')) return name
      return 'layers-' + name
    },
    layerIcon (layer) {
      return utils.getIconName(layer, 'icon')
    },
    toggleLayer (layer) {
      const toggleAction = _.find(layer.actions, { id: 'toggle' })
      if (toggleAction) toggleAction.handler()
    },
    onLayerClicked (layer) {
      if (layer.isDisabled) return
      if (this.options.exclusive) {
        const selectedLayer = _.find(this.layers, { isVisible: true })
        if (selectedLayer) this.toggleLayer(selectedLayer)
        if (layer === selectedLayer) return
      }
      this.toggleLayer(layer)
    }
  }
}
</script>
