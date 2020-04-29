<template>
  <div :style="widgetStyle()">
    <div v-if="selection" class="fit row">
      <k-tool-bar class="q-pa-sm" :actions="actions" direction="vertical" dense />
      <q-scroll-area class="col fit" :thumb-style="thumbStyle" :bar-style="barStyle">
        <k-view class="q-pa-md" :schema="schema" :values="properties" :options="viewOptions" />
      </q-scroll-area>
    </div>
    <div v-else class="absolute-center">
      <k-label :text="$t('KFeatureWidget.NO_FEATURE_SELECTED')" icon-size="48px" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import centroid from '@turf/centroid'
import { colors, copyToClipboard, exportFile  } from 'quasar'
import { baseWidget } from '../../../../core/client/mixins'
import { generatePropertiesSchema } from '../../utils'

export default {
  name: 'k-feature-widget',
  inject: ['kActivity'],
  mixins: [baseWidget],
  props: {
    feature: {
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
      actions: [],
      selection: false
    }
  },
  watch: {
    feature: function () {
      this.refresh()
    },
    options: function () {
      this.refresh()
    }
  },
  methods: {
    refresh () {
      if (this.feature && this.options) {
        // Is there any schema ?
        if (this.options.schema) {
          if (this.schema !== this.options.schema.content) this.schema = this.options.schema.content
        } else {
          this.schema = generatePropertiesSchema(this.feature)
        }
        // If 2D 
        if (this.kActivity.is2D()) {
          this.properties = this.kActivity.generateLeafletStyle('infobox', this.feature, this.options)
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
    async onCopyProperties () {
      if (this.feature) {
        try {
          await copyToClipboard(JSON.stringify(this.feature.properties))
          this.$toast({ type: 'positive', message: this.$t('KFeatureWidget.PROPERTIES_COPIED') })
        } catch (_) {
          this.$toast({ type: 'error', message: this.$t('KFeatureWidget.CANNOT_COPY_PROPERTIES') })
        }
      }
    },
    onExportFeature () {
      if (this.feature) {
        const name = _.get(this.feature, 'name', 'feature') || 
                     _.get(this.feature, 'label', 'feature') || 
                     _.get(this.feature, 'properties.name', 'feature') || 
                     _.get(this.feature, 'properties.label', 'feature')
        const file = name + '.geojson'
        const status = exportFile(file, JSON.stringify(this.feature))
        if (status) this.$toast({ type: 'error', message: this.$t('KFeatureWidget.FEATURE_EXPORTED', { file }) })
        else this.$toast({ type: 'error', message: this.$t('KFeatureWidget.CANNOT_EXPORT_FEATURE') })
      }
    }
  },
  created () {
    // laod the required components
    this.$options.components['k-tool-bar'] = this.$load('layout/KToolBar')
    this.$options.components['k-view'] = this.$load('form/KView')
    this.$options.components['k-label'] = this.$load('frame/KLabel')
    // Registers the actions
    this.actions = [
      { name: 'centerOn', icon: 'las la-eye', label: this.$t('KFeatureWidget.CENTER_ON'), handler: this.onCenterOn },
      { name: 'copyProperties', icon: 'las la-clipboard', label: this.$t('KFeatureWidget.COPY_PROPERTIES'), handler: this.onCopyProperties }, 
      { name: 'exportFeature', icon: 'img:statics/json-icon.svg', label: this.$t('KFeatureWidget.EXPORT_FEATURE'), handler: this.onExportFeature }, 
    ]
    // Refresh the component
    this.refresh()
  },
  mounted () {
    if (this.feature && this.layer && this.options) {
      this.kActivity.centerOnSelection()
      this.kActivity.addSelectionHighlight()
    }
  },
  beforeDestroy() {
    this.kActivity.removeSelectionHighlight()
  }
}
</script>
