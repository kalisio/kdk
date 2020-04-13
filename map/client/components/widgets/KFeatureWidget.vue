<template>
  <div :style="widgetStyle">
    <div v-if="selection" class="fit row q-pa-xs">
      <k-tool-bar class="q-pa-sm" :actions="actions" direction="vertical" dense  />
      <q-scroll-area :thumb-style="thumbStyle" :bar-style="barStyle" class="col fit">
        <k-view class="q-pa-md" :schema="schema" :values="properties" :options="viewOptions" />
      </q-scroll-area>
    </div>
    <div v-else class="absolute-center">
      <k-label :text="$t('KFeatureInfoBox.NO_FEATURE_SELECTED')" icon-size="48px" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import centroid from '@turf/centroid'
import { colors, copyToClipboard } from 'quasar'
import { baseWidget } from '../../../../core/client/mixins'
import utils from '../../../../core/client/utils'

export default {
  name: 'k-feature-widget',
  inject: ['kActivity'],
  mixins: [baseWidget],
  props: {
    feature: {
      type: Object,
      default: null
    },
    layer: {
      type: Object,
      default: null
    },
    options: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      thumbStyle: {
        right: '4px',
        borderRadius: '5px',
        backgroundColor: colors.getBrand('secondary'),
        width: '5px',
        opacity: 0.75
      },
      barStyle: {
        right: '2px',
        borderRadius: '9px',
        backgroundColor: colors.getBrand('primary'),
        width: '9px',
        opacity: 0.25
      },
      viewOptions: {
        labelWidth: 5,
        separators: true
      },
      schema: null,
      properties: null,
      selection: false,
      actions: []
    }
  },
  watch: {
    feature: function () {
      this.refresh()
    },
    layer: function () {
      this.refresh()
    },
    options: function () {
      this.refresh()
    }
  },
  methods: {
    refresh () {
      if (this.feature && this.layer && this.options) {
        if (this.schema !== this.options.schema.content) this.schema = this.options.schema.content
        if (this.kActivity.is2D()) {
          this.properties = this.kActivity.generateLeafletStyle('infobox', this.feature, this.layer, this.options)
        } else {
          this.properties = this.kActivity.generateCesiumStyle('infobox', this.feature, this.options)
        }
        this.selection = true
      } else {
        this.selection = false
      }
    },
    onCenterOn () {
      this.kActivity.centerOnSelection()
    },
    onCopyClipboard () {
      if (this.feature) copyToClipboard(JSON.stringify(this.feature))
      .then(() => {
        this.$toast({
          type: 'warning',
          html: this.$t('KFeatureWidget.FEATURE_COPIED_TO_CLIPBOARD')
        })
      })
      .catch(() => {
        this.$toast({
          type: 'error',
          html: this.$t('KFeatureWidget.CANNOT_COPY_FEATURE_TO_CLIPBOARD')
        })
      })
    }
  },
  created () {
    // laod the required components
    this.$options.components['k-view'] = this.$load('form/KView')
    this.$options.components['k-tool-bar'] = this.$load('layout/KToolBar')
    this.$options.components['k-label'] = this.$load('frame/KLabel')
    // Registers the actions
    this.actions = [
      { name: 'centerOn', icon: 'las la-eye', label: this.$t('KFeatureWidget.CENTER_ON'), handler: this.onCenterOn },
      { name: 'copyClipboard', icon: 'las la-clipboard', label: this.$t('KFeatureWidget.COPY_TO_CLIPBOARD'), handler: this.onCopyClipboard }, 
    ]
    // Refresh the component
    this.refresh()
  }
}
</script>
