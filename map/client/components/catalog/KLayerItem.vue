<template>
  <div :id="id" class="full-width row items-center q-pl-md q-pr-sm no-wrap">
    <!-- Layer toggle -->
    <q-toggle v-model="layer.isVisible" :disable="layer.isDisabled" size="sm" @update:modelValue="onToggled" />
    <!-- Layer name -->
    <div
      class="row ellipsis-2-lines"
      :class="{
        'text-primary': layer.isVisible,
        'text-grey-6': layer.isDisabled
      }"
    >
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
    <!-- Layer actions -->
    <k-panel
      :id="`${layer.name}-actions`"
      :content="layer.actions"
      :context="layer"
      :filter="{ id: { $nin: ['toggle', 'toggle-filter'] } }"
    />
  </div>
</template>

<script>
import _ from 'lodash'
import { utils } from '../../../../core/client'
import { KPanel } from '../../../../core/client/components'

export default {
  name: 'k-layer-item',
  components: {
    KPanel
  },
  props: {
    layer: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    id () {
      const name = _.kebabCase(this.layer.name)
      if (_.startsWith(name, 'layers-')) return name
      return 'layers-' + name
    },
    icon () {
      return utils.getIconName(this.layer, 'icon')
    }
  },
  methods: {
    onToggled () {
      this.$emit('toggled', this.layer)
    }
  }
}
</script>
