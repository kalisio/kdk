<template>
  <div :style="widgetStyle()">
    <div v-if="schema && properties" class="fit row">
      <k-panel id="information-box-actions" class="q-pa-sm" :content="actions" direction="vertical" />
      <q-scroll-area class="col fit" :thumb-style="thumbStyle" :bar-style="barStyle">
        <k-view class="q-pa-md" :schema="schema" :values="properties" :separators="true" />
      </q-scroll-area>
    </div>
    <div v-else class="absolute-center">
      <k-stamp icon="las la-exclamation-circle" icon-size="3rem" :text="$t('KInformationBox.NO_FEATURE_PROPERTIES')" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { colors, copyToClipboard, exportFile } from 'quasar'
import { baseWidget } from '../../../../core/client/mixins'
import { generatePropertiesSchema } from '../../utils'

export default {
  name: 'k-information-box',
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
      schema: null,
      properties: null,
      actions: []
    }
  },
  watch: {
    feature: function () {
      this.refresh()
    }
  },
  methods: {
    refresh () {
      this.properties = null
      this.schema = null
      if (this.feature && this.layer) {
        let schema
        // Is there any schema ?
        if (_.has(this.layer, 'schema.content')) {
          // As we update the schema does not alter the original one
          schema = _.cloneDeep(_.get(this.layer, 'schema.content'))
        } else {
          schema = generatePropertiesSchema(this.feature, this.layer.name)
        }
        // Ensure schema is not empty
        if (_.isNil(schema) || _.isEmpty(_.get(schema, 'properties', {}))) {
          return
        }
        // Retrieve filtered properties on feature/entity
        const properties = this.kActivity.generateStyle('infobox', this.feature, this.layer)
        if (_.isEmpty(properties)) {
          return
        }
        // Filter schema according to selected properties to avoid displying empty fields
        const keys = _.keys(properties)
        _.keys(schema.properties).forEach(key => {
          if (!keys.includes(key)) _.unset(schema, `properties.${key}`)
        })
        this.schema = schema
        this.properties = properties
        this.kActivity.centerOnSelection()
        this.kActivity.addSelectionHighlight('information-box')
      }
    },
    onCenterOn () {
      this.kActivity.centerOnSelection()
    },
    async onCopyProperties () {
      if (this.feature) {
        try {
          await copyToClipboard(JSON.stringify(this.feature.properties))
          this.$toast({ type: 'positive', message: this.$t('KInformationBox.PROPERTIES_COPIED') })
        } catch (_) {
          this.$toast({ type: 'error', message: this.$t('KInformationBox.CANNOT_COPY_PROPERTIES') })
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
        if (status) this.$toast({ type: 'error', message: this.$t('KInformationBox.FEATURE_EXPORTED', { file }) })
        else this.$toast({ type: 'error', message: this.$t('KInformationBox.CANNOT_EXPORT_FEATURE') })
      }
    }
  },
  created () {
    // laod the required components
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
    this.$options.components['k-view'] = this.$load('form/KView')
    this.$options.components['k-stamp'] = this.$load('frame/KStamp')
    // Registers the actions
    this.actions = {
      default: [
        { id: 'center-view', icon: 'las la-eye', tooltip: this.$t('KInformationBox.CENTER_ON'), handler: this.onCenterOn },
        { id: 'copy-properties', icon: 'las la-clipboard', tooltip: this.$t('KInformationBox.COPY_PROPERTIES'), handler: this.onCopyProperties },
        { id: 'export-feature', icon: 'img:statics/json-icon.svg', tooltip: this.$t('KInformationBox.EXPORT_FEATURE'), handler: this.onExportFeature }
      ]
    }
    // Refresh the component
    this.refresh()
  },
  beforeDestroy () {
    this.kActivity.removeSelectionHighlight('information-box')
  }
}
</script>
