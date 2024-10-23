<template>
  <div id="information-box" class="column">
    <div v-if="schema && properties" class="row full-width">
      <KView
        class="q-pa-md full-width"
        :values="properties"
        :schema="schema"
        :separators="true"
      />
    </div>
    <div v-else class="absolute-center">
      <KStamp
        icon="las la-exclamation-circle"
        icon-size="3rem"
        :text="$t('KInformationBox.NO_FEATURE_PROPERTIES')"
        text-size="1rem"
      />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import { copyToClipboard, exportFile } from 'quasar'
import { KView, KPanel, KStamp } from '../../../../core/client/components'
import { generatePropertiesSchema } from '../../utils'
import { useCurrentActivity, useHighlight } from '../../composables'

export default {
  components: {
    KView,
    KPanel,
    KStamp
  },
  data () {
    return {
      schema: null,
      properties: null
    }
  },
  props: {
    highlight: {
      type: Object,
      default: () => ({ 'stroke-color': 'primary', 'fill-opacity': 0, zOrder: 1 })
    }
  },
  computed: {
    feature () {
      return this.hasSelectedFeature() && this.getSelectedFeature()
    },
    layer () {
      return this.hasSelectedLayer() && this.getSelectedLayer()
    }
  },
  watch: {
    feature: {
      handler () {
        this.refresh()
      },
      immediate: true
    }
  },
  methods: {
    refresh () {
      this.properties = null
      this.schema = null
      this.clearHighlights()
      if (this.feature && this.layer) {
        this.highlight(this.feature, this.layer)
        this.centerOnSelection()
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
      }
    },
    hasFeature () {
      return this.feature
    },
    hasProperties () {
      return this.properties
    },
    onCenterOn () {
      this.centerOnSelection()
    },
    async onCopyProperties () {
      if (this.feature) {
        try {
          await copyToClipboard(JSON.stringify(this.feature.properties))
          this.$notify({ type: 'positive', message: this.$t('KInformationBox.PROPERTIES_COPIED') })
        } catch (error) {
          this.$notify({ type: 'negative', message: this.$t('KInformationBox.CANNOT_COPY_PROPERTIES') })
          logger.error(error)
        }
      }
    },
    onExportFeature () {
      if (this.feature) {
        const name = _.get(this.feature, 'name') ||
                      _.get(this.feature, 'label') ||
                      _.get(this.feature, 'properties.name') ||
                      _.get(this.feature, 'properties.label') ||
                      _.get(this.layer, 'name') ||
                      _.get(this.layer, 'properties.name')
        const file = name + '.geojson'
        const status = exportFile(file, JSON.stringify(this.feature))
        if (status) this.$notify({ type: 'negative', message: this.$t('KInformationBox.FEATURE_EXPORTED', { file }) })
        else this.$notify({ type: 'negative', message: this.$t('KInformationBox.CANNOT_EXPORT_FEATURE') })
      }
    }
  },
  setup (props) {
    // Expose
    return {
      ...useCurrentActivity(),
      ...useHighlight('information-box', props.highlight)
    }
  }
}
</script>
