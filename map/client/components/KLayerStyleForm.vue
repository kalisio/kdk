<template>
  <div>
    <k-icon-chooser ref="iconChooser" @icon-choosed="onIconChanged" />
    <k-color-chooser ref="colorChooser" @color-choosed="onColorChanged" />
    <q-expansion-item ref="general" default-opened icon="fas fa-low-vision" :label="$t('KLayerStyleForm.VISIBILITY')" group="group">
      <q-list dense class="row">
        <q-item>
          <q-item-section>
            <q-toggle v-model="isVisible"/>
          </q-item-section>
          <q-item-section avatar>
            {{$t('KLayerStyleForm.DEFAULT_VISIBILITY')}}
          </q-item-section>
        </q-item>
        <q-item class="col-12">
          <q-item-section class="col-1">
            <q-toggle v-model="hasMinZoom"/>
          </q-item-section>
          <q-item-section class="col-6">
          {{$t('KLayerStyleForm.MIN_ZOOM')}}
          </q-item-section>
          <q-item-section class="col-4">
            <q-slider v-model="minZoom" :disable="!hasMinZoom"
              :min="minViewerZoom" :max="hasMaxZoom ? maxZoom : maxViewerZoom" :step="1"
              label label-always :label-value="minZoom"/>
          </q-item-section>
        </q-item>
        <q-item class="col-12">
          <q-item-section class="col-1">
            <q-toggle v-model="hasMaxZoom"/>
          </q-item-section>
          <q-item-section class="col-6">
          {{$t('KLayerStyleForm.MAX_ZOOM')}}
          </q-item-section>
          <q-item-section class="col-4">
            <q-slider v-model="maxZoom" :disable="!hasMaxZoom"
              :min="hasMinZoom ? minZoom : minViewerZoom" :max="maxViewerZoom" :step="1"
              label label-always :label-value="maxZoom"/>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-expansion-item ref="points" icon="fas fa-map-marker-alt" :label="$t('KLayerStyleForm.POINTS')" group="group">
      <q-list dense class="row items-center justify-around q-pa-md">
        <q-item class="col-12">
          <q-item-section class="col-1">
            <q-toggle v-model="clustering"/>
          </q-item-section>
          <q-item-section class="col-6">
          {{$t('KLayerStyleForm.POINT_CLUSTERING')}}
          </q-item-section>
          <q-item-section class="col-4">
            <q-slider v-model="disableClusteringAtZoom" :disable="!clustering"
              :min="minViewerZoom" :max="maxViewerZoom" :step="1"
              label label-always :label-value="disableClusteringAtZoom"/>
          </q-item-section>
        </q-item>
        <q-item class="col-12">
          <q-item-section avatar>
            <q-chip clickable v-ripple text-color="white"
              :icon="defaultIcon['icon-classes']" :color="defaultIcon['marker-color']" @click="onIconClicked(defaultIcon)"/>
          </q-item-section>
          <q-item-section>
            {{$t('KLayerStyleForm.DEFAULT_POINT_STYLE')}}
          </q-item-section>
        </q-item>
        <q-item v-for="iconStyle in iconStyles" :key="iconStyle.key" class="col-12">
          <q-item-section avatar>
            <q-chip clickable v-ripple text-color="white"
              :icon="iconStyle['icon-classes']" :color="iconStyle['marker-color']" @click="onIconClicked(iconStyle)"/>
          </q-item-section>
          <q-item-section>
            <component
              :is="iconStyle.componentKey"
              :ref="iconStyle.key"
              :properties="iconStyle.properties"
              :display="{ icon: true, label: true, labelWidth: 3 }"
              @field-changed="iconStyle.onValueChanged"
            />
          </q-item-section>
          <q-item-section avatar>
            <q-btn flat color="primary" icon="delete" @click="onRemoveIconStyle(iconStyle)">
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                {{$t('KLayerStyleForm.REMOVE_POINT_STYLE')}}
              </q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
        <q-item class="col-12">
          <q-item-section avatar class="col-6">
            {{$t('KLayerStyleForm.ADD_POINT_STYLE')}}
          </q-item-section>
          <q-item-section class="col-6">
            <q-select v-model="property" :options="properties">
              <template v-slot:after>
                <q-btn v-if="property" round dense flat icon="add" @click="onAddIconStyle(property)"/>
              </template>
            </q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-expansion-item ref="lines" icon="fas fa-grip-lines" :label="$t('KLayerStyleForm.LINES')" group="group">
      <q-list dense class="row items-center justify-around q-pa-md">
        <q-item class="col-12">
          <q-item-section class="col-4">
            {{$t('KLayerStyleForm.DEFAULT_LINE_STYLE')}}
          </q-item-section>
          <q-item-section class="col-1">
            <q-btn round small :color="defaultLine['stroke-color']" @click="onColorClicked(defaultLine, 'stroke-color')">
            </q-btn>
          </q-item-section>
          <q-item-section class="col-3">
            <q-slider v-model="defaultLine['stroke-width']"
              :min="1" :max="20" :step="1"
              label label-always :label-value="$t('KLayerStyleForm.LINE_WIDTH') + defaultLine['stroke-width'] + 'px'"/>
          </q-item-section>
          <q-item-section class="col-3">
            <q-slider v-model="defaultLine['stroke-opacity']"
              :min="0" :max="1" :step="0.1"
              label label-always :label-value="$t('KLayerStyleForm.LINE_OPACITY') + defaultLine['stroke-opacity']"/>
          </q-item-section>
        </q-item>
        <q-item v-for="lineStyle in lineStyles" :key="lineStyle.key" class="col-12">
          <q-item-section class="col-4">
            <component
              :is="lineStyle.componentKey"
              :ref="lineStyle.key"
              :properties="lineStyle.properties"
              :display="{ icon: true, label: true, labelWidth: 3 }"
              @field-changed="lineStyle.onValueChanged"
            />
          </q-item-section>
          <q-item-section class="col-1">
            <q-btn round small :color="lineStyle['stroke-color']" @click="onColorClicked(lineStyle, 'stroke-color')">
            </q-btn>
          </q-item-section>
          <q-item-section class="col-3">
            <q-slider v-model="lineStyle['stroke-width']"
              :min="1" :max="20" :step="1"
              label label-always :label-value="$t('KLayerStyleForm.LINE_WIDTH') + lineStyle['stroke-width'] + 'px'"/>
          </q-item-section>
          <q-item-section class="col-3">
            <q-slider v-model="lineStyle['stroke-opacity']"
              :min="0" :max="1" :step="0.1"
              label label-always :label-value="$t('KLayerStyleForm.LINE_OPACITY') + lineStyle['stroke-opacity']"/>
          </q-item-section>
          <q-item-section avatar>
            <q-btn flat color="primary" icon="delete" @click="onRemoveLineStyle(lineStyle)">
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                {{$t('KLayerStyleForm.REMOVE_LINE_STYLE')}}
              </q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
        <q-item class="col-12">
          <q-item-section avatar class="col-6">
            {{$t('KLayerStyleForm.ADD_LINE_STYLE')}}
          </q-item-section>
          <q-item-section class="col-6">
            <q-select v-model="property" :options="properties">
              <template v-slot:after>
                <q-btn v-if="property" round dense flat icon="add" @click="onAddLineStyle(property)"/>
              </template>
            </q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-expansion-item ref="polygons" icon="fas fa-draw-polygon" :label="$t('KLayerStyleForm.POLYGONS')" group="group">
      <q-list dense class="row items-center justify-around q-pa-md">
        <q-item class="col-12">
          <q-item-section class="col-4">
            {{$t('KLayerStyleForm.DEFAULT_POLYGON_FILL_STYLE')}}
          </q-item-section>
          <q-item-section class="col-1">
            <q-btn round small :color="defaultPolygon['fill-color']" @click="onColorClicked(defaultPolygon, 'fill-color')">
            </q-btn>
          </q-item-section>
          <q-item-section class="col-3">
            <q-slider v-model="defaultPolygon['fill-opacity']"
              :min="0" :max="1" :step="0.1"
              label label-always :label-value="$t('KLayerStyleForm.POLYGON_FILL_OPACITY') + defaultPolygon['fill-opacity']"/>
          </q-item-section>
        </q-item>
        <q-item v-for="polygonStyle in polygonStyles" :key="polygonStyle.key" class="col-12">
          <q-item-section class="col-4">
            <component
              :is="polygonStyle.componentKey"
              :ref="polygonStyle.key"
              :properties="polygonStyle.properties"
              :display="{ icon: true, label: true, labelWidth: 3 }"
              @field-changed="polygonStyle.onValueChanged"
            />
          </q-item-section>
          <q-item-section class="col-1">
            <q-btn round small :color="polygonStyle['fill-color']" @click="onColorClicked(polygonStyle, 'fill-color')">
            </q-btn>
          </q-item-section>
          <q-item-section class="col-3">
            <q-slider v-model="polygonStyle['fill-opacity']"
              :min="0" :max="1" :step="0.1"
              label label-always :label-value="$t('KLayerStyleForm.POLYGON_FILL_OPACITY') + polygonStyle['fill-opacity']"/>
          </q-item-section>
          <q-item-section avatar>
            <q-btn flat color="primary" icon="delete" @click="onRemovePolygonStyle(polygonStyle)">
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                {{$t('KLayerStyleForm.REMOVE_POLYGON_STYLE')}}
              </q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
        <q-item class="col-12">
          <q-item-section avatar class="col-6">
            {{$t('KLayerStyleForm.ADD_LINE_STYLE')}}
          </q-item-section>
          <q-item-section class="col-6">
            <q-select v-model="property" :options="properties">
              <template v-slot:after>
                <q-btn v-if="property" round dense flat icon="add" @click="onAddPolygonStyle(property)"/>
              </template>
            </q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-expansion-item ref="popup" icon="fas fa-comment-alt" :label="$t('KLayerStyleForm.POPUP')" group="group">
      <q-list dense class="row items-center justify-around q-pa-md">
        <q-item class="col-12">
          <q-item-section class="col-1">
            <q-toggle v-model="popup"/>
          </q-item-section>
          <q-item-section avatar class="col-5">
            {{$t('KLayerStyleForm.ADD_POPUP')}}
          </q-item-section>
          <q-item-section class="col-6">
            <q-select :disable="!popup" v-model="popupProperties" multiple :options="properties"></q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-expansion-item ref="tooltip" icon="fas fa-mouse-pointer" :label="$t('KLayerStyleForm.TOOLTIP')" group="group">
      <q-list dense class="row items-center justify-around q-pa-md">
        <q-item class="col-12">
          <q-item-section class="col-1">
            <q-toggle v-model="tooltip"/>
          </q-item-section>
          <q-item-section avatar class="col-5">
            {{$t('KLayerStyleForm.ADD_TOOLTIP')}}
          </q-item-section>
          <q-item-section class="col-6">
            <q-select :disable="!tooltip" v-model="tooltipProperty" :options="properties"></q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-expansion-item ref="infobox" icon="fas fa-th-list" :label="$t('KLayerStyleForm.INFOBOX')" group="group">
      <q-list dense class="row items-center justify-around q-pa-md">
        <q-item class="col-12">
          <q-item-section class="col-1">
            <q-toggle v-model="infobox"/>
          </q-item-section>
          <q-item-section avatar class="col-5">
            {{$t('KLayerStyleForm.ADD_POPUP')}}
          </q-item-section>
          <q-item-section class="col-6">
            <q-select :disable="!infobox" v-model="infoboxProperties" multiple :options="properties"></q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-list v-show="hasError" dense class="row items-center justify-around q-pa-md">
      <q-item>
        <q-item-section side>
          <q-icon name="warning" color="negative" />
        </q-item-section>
        <q-item-section class="text-negative">
        {{error}}
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import { QSlider, uid } from 'quasar'
import { mixins as kCoreMixins, utils as kCoreUtils } from '../../../core/client'

export default {
  name: 'k-layer-style-form',
  components: {
    QSlider
  },
  mixins: [
    kCoreMixins.schemaProxy,
    kCoreMixins.refsResolver()
  ],
  props: {
    layer: { type: Object, required: true },
    options: { type: Object, required: true } // Contains default style options
  },
  computed: {
    fields () {
      return _.get(this.layer, 'schema.content.properties', {})
    },
    properties () {
      let properties = []
      _.forOwn(this.fields, (value, key) => {
        // Use helper or ID
        properties.push({
          label: _.get(value, 'field.helper', key),
          value: key
        })
      })
      return properties
    },
    hasIconStyles () {
      return this.iconStyles.length > 0
    },
    hasLineStyles () {
      return this.lineStyles.length > 0
    },
    hasPolygonStyles () {
      return this.polygonStyles.length > 0
    }
  },
  data () {
    return {
      minViewerZoom: null,
      maxViewerZoom: null,
      property: null,
      isVisible: true,
      hasMinZoom: false,
      hasMaxZoom: false,
      minZoom: 0,
      maxZoom: 0,
      popup: false,
      popupProperties: [],
      tooltip: false,
      tooltipProperty: null,
      infobox: false,
      infoboxProperties: [],
      clustering: true,
      disableClusteringAtZoom: 18,
      defaultIcon: {},
      iconStyles: [],
      defaultLine: {},
      lineStyles: [],
      defaultPolygon: {},
      polygonStyles: [],
      hasError: false,
      error: ''
    }
  },
  methods: {
    async build () {
      logger.debug('Building layer style form')
      // Since some properties are injected in form we need to make sure Vue.js has processed props
      // This could be done externally but adding it here we ensure no one will forget it
      await this.$nextTick()
      this.hasError = false
      this.property = this.properties[0]
    },
    async loadStyleComponents (styles) {
      // Since we use dynamic component loading we need to make sure Vue.js has loaded them
      // Set the refs to be resolved
      this.setRefs(styles.map(style => style.key))
      await this.loadRefs()
      styles.forEach(style => this.$refs[style.key][0].fill(style.value))
    },
    processTemplates(values, properties, defaultStyle, styles) {
      // We have styles for a set of values templated using if statements
      // Split after else statement to get default style values
      const templates = properties.map(property => _.get(values, `leaflet.${property}`).split('} else {'))
      properties.forEach((property, index) => {
        // Conversion from palette to RGB color is required
        const value = (property.includes('color') ?
          kCoreUtils.getPaletteFromColor(templates[index][1].match(/%>([^<%]+)<%/)[1]) :
          templates[index][1].match(/%>([^<%]+)<%/)[1])
        defaultStyle[property] = value
      })
      // Match properties equality to get property names
      const propertyNameRegex = /properties.([^===]+)===/g
      // Match quotes to get property values and %> <% to get icon colors/names
      const propertyValueRegex = /"([^"]+)"/g
      // Match %> <% block to get style values
      const regexs = properties.map(property => /%>([^<%]+)<%/g)
      let propertyValue
      // As all templates have the same conditional structure use the first template to extract property values
      while ((propertyValue = propertyValueRegex.exec(templates[0][0])) !== null) {
        let propertyName = propertyNameRegex.exec(templates[0][0])[1].trim()
        // Take care that toString() is used to convert numbers to strings in templates
        const isNumber = propertyName.includes('.toString()')
        propertyName = propertyName.replace('.toString()', '')
        let style = {}
        properties.forEach((property, index) => {
          const value = regexs[index].exec(templates[index][0])[1].trim()
          // Conversion from palette to RGB color is required
          style[property] = (property.includes('color') ?
            kCoreUtils.getPaletteFromColor(value) :
            (_.isNumber(value) ? Number(value) : value))
        })
        style.value = propertyValue[1].replace('"', '').trim()
        if (isNumber) style.value = _.toNumber(style.value)
        styles.push(this.createStyle(propertyName, style))
      }
    },
    fillVisibilityStyle(values) {
      this.isVisible = _.get(values, 'leaflet.isVisible', true)
      this.hasMinZoom = _.has(values, 'leaflet.minZoom')
      if (this.hasMinZoom) this.minZoom = _.get(values, 'leaflet.minZoom')
      this.hasMaxZoom = _.has(values, 'leaflet.maxZoom')
      if (this.hasMaxZoom) this.minZoom = _.get(values, 'leaflet.maxZoom')
    },
    fillClusteringStyle(values) {
      this.clustering = (_.get(values, 'leaflet.cluster', _.get(this.options, 'cluster')) ? true : false)
      this.disableClusteringAtZoom = _.get(values, 'leaflet.cluster.disableClusteringAtZoom',
        _.get(this.options, 'cluster.disableClusteringAtZoom', 18))
    },
    async fillIconStyles(values) {
      this.iconStyles = []
      const templates = _.get(values, 'leaflet.template', [])
      // When no template we have a single default icon
      if (!templates.includes('marker-color') && !templates.includes('icon-classes')) {
        // Conversion from palette to RGB color is required for markers
        this.defaultIcon['marker-color'] = kCoreUtils.getPaletteFromColor(_.get(values, 'leaflet.marker-color',
          _.get(this.options, 'pointStyle.icon.options.markerColor', 'blue')))
        this.defaultIcon['icon-classes'] = _.get(values, 'leaflet.icon-classes',
          _.get(this.options, 'pointStyle.icon.options.iconClasses', 'fas fa-circle'))
      } else {
        this.processTemplates(values, ['marker-color', 'icon-classes'], this.defaultIcon, this.iconStyles)
        await this.loadStyleComponents(this.iconStyles)
      }
    },
    async fillLineStyles(values) {
      this.lineStyles = []
      const templates = _.get(values, 'leaflet.template', [])
      // When no template we have a single default style
      if (!templates.includes('stroke-color') && !templates.includes('stroke-width') && !templates.includes('stroke-opacity')) {
        // Conversion from palette to RGB color is required for path style
        this.defaultLine['stroke-color'] = kCoreUtils.getPaletteFromColor(_.get(values, 'leaflet.stroke-color',
          kCoreUtils.getColorFromPalette(_.get(this.options, 'featureStyle.color'), 'red')))
        this.defaultLine['stroke-width'] = _.get(values, 'leaflet.stroke-width',
          _.get(this.options, 'featureStyle.weight', 1))
        this.defaultLine['stroke-opacity'] = _.get(values, 'leaflet.stroke-opacity',
          _.get(this.options, 'featureStyle.opacity', 1))
      } else {
        this.processTemplates(values, ['stroke-color', 'stroke-width', 'stroke-opacity'], this.defaultLine, this.lineStyles)
        await this.loadStyleComponents(this.lineStyles)
      }
    },
    async fillPolygonStyles(values) {
      this.polygonStyles = []
      const templates = _.get(values, 'leaflet.template', [])
      // When no template we have a single default style
      if (!templates.includes('fill-color') && !templates.includes('fill-opacity')) {
        // Conversion from palette to RGB color is required for path style
        this.defaultPolygon['fill-color'] = kCoreUtils.getPaletteFromColor(_.get(values, 'leaflet.fill-color',
          kCoreUtils.getColorFromPalette(_.get(this.options, 'featureStyle.fillColor', 'green'))))
        this.defaultPolygon['fill-opacity'] = _.get(values, 'leaflet.fill-opacity',
          _.get(this.options, 'featureStyle.fillOpacity', 1))
      } else {
        this.processTemplates(values, ['fill-color', 'fill-opacity'], this.defaultPolygon, this.polygonStyles)
        await this.loadStyleComponents(this.polygonStyles)
      }
    },
    async fillPopupStyles(values) {
      this.popup = (_.get(values, 'leaflet.popup') ? true : false)
      this.popupProperties = _.get(values, 'leaflet.popup.pick',
        _.get(this.options, 'popup.pick', this.properties.map(property => property.value)))
      // Jump to select data model
      if (this.popupProperties) this.popupProperties = this.popupProperties.map(property =>
        _.find(this.properties, { value: property })
      )
    },
    async fillTooltipStyles(values) {
      this.tooltip = (_.get(values, 'leaflet.tooltip') ? true : false)
      this.tooltipProperty = _.get(values, 'leaflet.tooltip.property',
        _.get(this.options, 'tooltip.property', null))
      // Jump to select data model
      if (this.tooltipProperty) this.tooltipProperty = _.find(this.properties, { value: this.tooltipProperty })
    },
    async fillInfoBoxStyles(values) {
      this.infobox = (_.get(values, 'leaflet.infobox') ? true : false)
      this.infoboxProperties = _.get(values, 'leaflet.infobox.pick',
        _.get(this.options, 'infobox.pick', this.properties.map(property => property.value)))
      // Jump to select data model
      if (this.infoboxProperties) this.infoboxProperties = this.infoboxProperties.map(property =>
        _.find(this.properties, { value: property })
      )
    },
    async fill (values) {
      logger.debug('Filling layer style form', values)
      // Visibility
      this.fillVisibilityStyle(values)
      // Clustering
      this.fillClusteringStyle(values)
      // Points
      await this.fillIconStyles(values)
      // Lines
      await this.fillLineStyles(values)
      // Polygons
      await this.fillPolygonStyles(values)
      // Popup
      await this.fillPopupStyles(values)
      // Tooltip
      await this.fillTooltipStyles(values)
      // Infobox
      await this.fillInfoBoxStyles(values)
    },
    validate () {
      const values = this.values()
      logger.debug('Validating layer style form', values)
      return {
        isValid: !this.hasError,
        values
      }
    },
    generateTemplates(properties, defaultStyle, styles) {
      const hasStyles = (styles.length > 0)
      let values = {}
      let templates = properties.map(property => '')
      // Process all styles
      styles.forEach(style => {
        properties.forEach((property, index) => {
          // Conversion from palette to RGB color is required
          const value = (property.includes('color') ?
            kCoreUtils.getColorFromPalette(style[property]) :
            style[property])
          const propertyName = style.property
          const propertyValue = style.value
          // Generate style value for given property value
          templates[index] += (typeof propertyValue === 'number' ?
            `if (properties.${propertyName}.toString() === "${propertyValue}") { %>${value}<% } else ` :
            `if (properties.${propertyName} === "${propertyValue}") { %>${value}<% } else `)
        })
      })
      // Process default style
      properties.forEach((property, index) => {
        // Conversion from palette to RGB color is required
        const value = (property.includes('color') ?
          kCoreUtils.getColorFromPalette(defaultStyle[property]) :
          defaultStyle[property])
        // Avoid converting numbers to string on default values
        if (hasStyles) templates[index] += `{ %>${value}<% }`
        else templates[index] = value
      })
      // Set all templates
      properties.forEach((property, index) => {
        values[`leaflet.${property}`] = (hasStyles ? `<% ${templates[index]} %>` : templates[index])
      })
      values['leaflet.template'] = (hasStyles ? properties : [])
      return values
    },
    visibilityValues () {
      let values = {
        'leaflet.isVisible': this.isVisible
      }
      if (this.hasMinZoom) values['leaflet.minZoom'] = this.minZoom
      if (this.hasMaxZoom) values['leaflet.maxZoom'] = this.maxZoom
      return values
    },
    clusteringValues () {
      return {
        'leaflet.cluster': (this.clustering ? { disableClusteringAtZoom: this.disableClusteringAtZoom } : false)
      }
    },
    iconStylesValues() {
      let values = this.generateTemplates(['marker-color', 'icon-classes'], this.defaultIcon, this.iconStyles)
      values['leaflet.icon-color'] = '#FFFFFF'
      return values
    },
    lineStylesValues() {
      return this.generateTemplates(['stroke-color', 'stroke-width', 'stroke-opacity'], this.defaultLine, this.lineStyles)
    },
    polygonStylesValues() {
      return this.generateTemplates(['fill-color', 'fill-opacity'], this.defaultPolygon, this.polygonStyles)
    },
    popupStylesValues() {
      return {
        'leaflet.popup': (this.popup ? { pick: this.popupProperties.map(property => property.value) } : undefined)
      }
    },
    tooltipStylesValues() {
      return {
        'leaflet.tooltip': (this.tooltip ? { property: this.tooltipProperty.value } : undefined)
      }
    },
    infoBoxStylesValues() {
      return {
        'leaflet.infobox': (this.infobox ? { pick: this.popupProperties.map(property => property.value) } : undefined)
      }
    },
    values () {
      let values = {}
      // Be default lodash merges objects only not arrays
      // As the template style property is one we need this
      const customizer = (objValue, srcValue) => {
        if (_.isArray(objValue)) return objValue.concat(srcValue)
      }
      // Visibility properties
      _.merge(values, this.visibilityValues())
      // Clustering
      _.merge(values, this.clusteringValues())
      // Point style
      _.mergeWith(values, this.iconStylesValues(), customizer)
      // Line style
      _.mergeWith(values, this.lineStylesValues(), customizer)
      // Polygon style
      _.mergeWith(values, this.polygonStylesValues(), customizer)
      // Popup style
      _.merge(values, this.popupStylesValues())
      // Tooltip style
      _.merge(values, this.tooltipStylesValues())
      // Infobox style
      _.merge(values, this.infoBoxStylesValues())
      return values
    },
    createStyle (property, options = {}) {
      // Retrieve schema descriptor
      const properties = this.fields[property]
      const componentKey = _.kebabCase(properties.field.component)
      // Load the required component if not previously loaded
      if (!this.$options.components[componentKey]) {
        this.$options.components[componentKey] = this.$load(properties.field.component)
      }
      let style = {
        key: uid().toString(), componentKey, property, properties,
        onValueChanged: (field, value) => style.value = value
      }
      return Object.assign(style, options)
    },
    onAddIconStyle (property) {
      this.iconStyles.push(this.createStyle(property.value, {
        // Default icon
        name: _.get(this.options, 'pointStyle.icon.options.iconClasses', 'fas fa-circle'),
        color: _.get(this.options, 'pointStyle.icon.options.markerColor', 'blue')
      }))
    },
    onRemoveIconStyle (style) {
      // Required to update the array to make it reactive
      this.iconStyles = this.iconStyles.filter(item => item.key !== style.key)
    },
    onIconClicked (style) {
      this.editedStyle = style
      this.$refs.iconChooser.open(style['icon-classes'], style['marker-color'])
    },
    onIconChanged (icon) {
      Object.assign(this.editedStyle, {
        'marker-color': icon.color,
        'icon-classes': icon.name
      })
    },
    onColorClicked (style, color) {
      this.editedStyle = style
      this.editedColor = color
      this.$refs.colorChooser.open(_.get(style, color))
    },
    onColorChanged (color) {
      _.set(this.editedStyle, this.editedColor, color)
    },
    onAddLineStyle (property) {
      this.lineStyles.push(this.createStyle(property.value, {
        // Default line
        'stroke-color': _.get(this.options, 'featureStyle.color', 'red'),
        'stroke-width': _.get(this.options, 'featureStyle.weight', 1),
        'stroke-opacity': _.get(this.options, 'featureStyle.opacity', 1)
      }))
    },
    onRemoveLineStyle (style) {
      // Required to update the array to make it reactive
      this.lineStyles = this.lineStyles.filter(item => item.key !== style.key)
    },
    onAddPolygonStyle (property) {
      this.polygonStyles.push(this.createStyle(property.value, {
        // Default line
        'fill-color': _.get(this.options, 'featureStyle.fillColor', 'green'),
        'fill-opacity': _.get(this.options, 'featureStyle.fillOpacity', 1)
      }))
    },
    onRemovePolygonStyle (style) {
      // Required to update the array to make it reactive
      this.polygonStyles = this.polygonStyles.filter(item => item.key !== style.key)
    }
  },
  async created () {
    // Load the required components
    this.$options.components['k-icon-chooser'] = this.$load('input/KIconChooser')
    this.$options.components['k-color-chooser'] = this.$load('input/KColorChooser')
    this.minViewerZoom = this.minZoom = _.get(this.options, 'viewer.minZoom', 1)
    this.maxViewerZoom = this.maxZoom = _.get(this.options, 'viewer.maxZoom', 18)
    await this.build()
    this.$emit('form-ready', this)
  }
}
</script>
