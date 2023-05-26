<template>
  <div>
    <k-icon-chooser ref="iconChooser" @icon-choosed="onIconChanged" />
    <k-color-chooser ref="colorChooser" @color-choosed="onColorChanged" />
    <q-expansion-item id="style-general-group" default-opened icon="las la-low-vision" :label="$t('KLayerStyleForm.BASE')" group="group">
      <q-list dense class="row">
        <q-item class="col-12">
          <q-item-section class="col-1">
            <q-toggle v-model="isVisible"/>
          </q-item-section>
          <q-item-section class="col-11 text-left">
            {{$t('KLayerStyleForm.DEFAULT_VISIBILITY')}}
          </q-item-section>
        </q-item>
        <q-item class="col-12">
          <q-item-section class="col-1">
            <q-toggle id="style-toggle-minzoom" v-model="hasMinZoom"/>
          </q-item-section>
          <q-item-section class="col-6 text-left">
          {{$t('KLayerStyleForm.MIN_ZOOM')}}
          </q-item-section>
          <q-item-section class="col-4 text-left">
            <q-slider id="style-set-minzoom" v-model="minZoom" :disable="!hasMinZoom"
              :min="minViewerZoom" :max="hasMaxZoom ? maxZoom : maxViewerZoom" :step="1"
              label label-always :label-value="minZoom"/>
          </q-item-section>
        </q-item>
        <q-item class="col-12">
          <q-item-section class="col-1">
            <q-toggle id="style-toggle-maxzoom" v-model="hasMaxZoom"/>
          </q-item-section>
          <q-item-section class="col-6 text-left">
          {{$t('KLayerStyleForm.MAX_ZOOM')}}
          </q-item-section>
          <q-item-section class="col-4">
            <q-slider id="style-set-maxzoom" v-model="maxZoom" :disable="!hasMaxZoom"
              :min="hasMinZoom ? minZoom : minViewerZoom" :max="maxViewerZoom" :step="1"
              label label-always :label-value="maxZoom"/>
          </q-item-section>
        </q-item>
        <q-item class="col-12" v-if="isVectorLayer">
          <q-item-section class="col-1">
            <q-toggle id="style-is-selectable" v-model="isSelectable"/>
          </q-item-section>
          <q-item-section class="col-4 text-left">
            {{$t('KLayerStyleForm.SELECTABLE')}}
          </q-item-section>
        </q-item>
        <q-item v-if="!hasFeatureSchema" class="col-12">
          <q-item-section class="col-1">
            <q-toggle v-model="hasOpacity"/>
          </q-item-section>
          <q-item-section class="col-6 text-left">
          {{$t('KLayerStyleForm.LAYER_OPACITY')}}
          </q-item-section>
          <q-item-section class="col-4">
            <q-slider v-model="opacity" :disable="!hasOpacity"
              :min="0" :max="1" :step="0.1"
              label label-always :label-value="$t('KLayerStyleForm.OPACITY') + ' ' + opacity"/>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-expansion-item v-if="isVectorLayer" id="style-point-group" icon="las la-map-marker-alt" :label="$t('KLayerStyleForm.POINTS')" group="group">
      <q-list dense class="row items-center justify-around q-pa-md">
        <q-item class="col-12">
          <q-item-section class="col-1">
            <q-toggle id="style-toggle-clustering" v-model="clustering"/>
          </q-item-section>
          <q-item-section class="col-6 text-left">
          {{$t('KLayerStyleForm.POINT_CLUSTERING')}}
          </q-item-section>
          <q-item-section class="col-4">
            <q-slider id="style-point-clustering" v-model="disableClusteringAtZoom" :disable="!clustering"
              :min="minViewerZoom" :max="maxViewerZoom" :step="1"
              label label-always :label-value="disableClusteringAtZoom"/>
          </q-item-section>
        </q-item>
        <q-item class="col-12">
          <q-item-section avatar>
            <q-chip id="style-point-icons" clickable v-ripple text-color="white"
              :icon="defaultIcon['icon-classes']" :color="defaultIcon['marker-color']" @click="onIconClicked(defaultIcon)"/>
          </q-item-section>
          <q-item-section>
            {{$t('KLayerStyleForm.DEFAULT_POINT_STYLE')}}
          </q-item-section>
        </q-item>
        <q-item v-bind:id="'point-feature-schema-' + color" v-if="hasFeatureSchema" v-for="iconStyle in iconStyles" :key="iconStyle.key" class="col-12">
          <q-item-section avatar>
            <q-chip clickable v-ripple text-color="white"
              :icon="iconStyle['icon-classes']" :color="iconStyle['marker-color']" @click="onIconClicked(iconStyle)"/>
          </q-item-section>
          <q-item-section avatar class="col-4">
            <q-select v-if="iconStyle.operator" v-model="iconStyle.operator" :label="iconStyle.property" stack-label :options="getOperators(iconStyle)" emit-value map-options/>
          </q-item-section>
          <q-item-section class="col-5">
            <component
              :is="iconStyle.component"
              :ref="iconStyle.onComponentCreated"
              :properties="iconStyle.properties"
              :display="{ icon: false, label: false }"
              @field-changed="iconStyle.onValueChanged"
            />
          </q-item-section>
          <q-item-section avatar>
            <q-btn flat color="primary" icon="las la-trash" @click="onRemoveIconStyle(iconStyle)">
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                {{$t('KLayerStyleForm.REMOVE_POINT_STYLE')}}
              </q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
        <q-item v-if="hasFeatureSchema" class="col-12">
          <q-item-section avatar class="col-6 text-left">
            {{$t('KLayerStyleForm.ADD_POINT_STYLE')}}
          </q-item-section>
          <q-item-section class="col-6">
            <q-select v-model="property" :options="properties">
              <template v-slot:after>
                <q-btn v-if="property" round dense flat icon="las la-plus" @click="onAddIconStyle(property)"/>
              </template>
            </q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-expansion-item v-if="isVectorLayer" id="style-line-group" icon="las la-grip-lines" :label="$t('KLayerStyleForm.LINES')" group="group">
      <q-list dense class="row items-center justify-around q-pa-md">
        <q-item class="col-12">
          <q-item-section class="col-6 text-left">
            {{$t('KLayerStyleForm.DEFAULT_LINE_STYLE')}}
          </q-item-section>
          <q-item-section class="col-1">
            <q-btn id="style-line-color" round small :color="defaultLine['stroke-color']" @click="onColorClicked(defaultLine, 'stroke-color')">
            </q-btn>
          </q-item-section>
          <q-item-section class="col-2">
            <q-slider id="style-line-width" v-model="defaultLine['stroke-width']"
              :min="1" :max="20" :step="1"
              label label-always :label-value="$t('KLayerStyleForm.LINE_WIDTH') + defaultLine['stroke-width'] + 'px'"/>
          </q-item-section>
          <q-item-section class="col-2">
            <q-slider id="style-line-opacity" v-model="defaultLine['stroke-opacity']"
              :min="0" :max="1" :step="0.1"
              label label-always :label-value="$t('KLayerStyleForm.LINE_OPACITY') + defaultLine['stroke-opacity']"/>
          </q-item-section>
        </q-item>
        <q-item v-if="hasFeatureSchema" v-for="lineStyle in lineStyles" :key="lineStyle.key" class="col-12">
          <q-item-section avatar class="col-3">
            <q-select v-if="lineStyle.operator" v-model="lineStyle.operator" :label="lineStyle.property" stack-label :options="getOperators(lineStyle)" emit-value map-options/>
          </q-item-section>
          <q-item-section class="col-3">
            <component
              :is="lineStyle.component"
              :ref="lineStyle.onComponentCreated"
              :properties="lineStyle.properties"
              :display="{ icon: false, label: false }"
              @field-changed="lineStyle.onValueChanged"
            />
          </q-item-section>
          <q-item-section class="col-1">
            <q-btn round small :color="lineStyle['stroke-color']" @click="onColorClicked(lineStyle, 'stroke-color')">
            </q-btn>
          </q-item-section>
          <q-item-section class="col-2">
            <q-slider v-model="lineStyle['stroke-width']"
              :min="1" :max="20" :step="1"
              label label-always :label-value="$t('KLayerStyleForm.LINE_WIDTH') + lineStyle['stroke-width'] + 'px'"/>
          </q-item-section>
          <q-item-section class="col-2">
            <q-slider v-model="lineStyle['stroke-opacity']"
              :min="0" :max="1" :step="0.1"
              label label-always :label-value="$t('KLayerStyleForm.LINE_OPACITY') + lineStyle['stroke-opacity']"/>
          </q-item-section>
          <q-item-section avatar>
            <q-btn flat color="primary" icon="las la-trash" @click="onRemoveLineStyle(lineStyle)">
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                {{$t('KLayerStyleForm.REMOVE_LINE_STYLE')}}
              </q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
        <q-item v-if="hasFeatureSchema" class="col-12">
          <q-item-section avatar class="col-6 text-left">
            {{$t('KLayerStyleForm.ADD_LINE_STYLE')}}
          </q-item-section>
          <q-item-section class="col-6">
            <q-select v-model="property" :options="properties">
              <template v-slot:after>
                <q-btn v-if="property" round dense flat icon="las la-plus" @click="onAddLineStyle(property)"/>
              </template>
            </q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-expansion-item v-if="isVectorLayer" id="style-polygon-group" icon="las la-draw-polygon" :label="$t('KLayerStyleForm.POLYGONS')" group="group">
      <q-list dense class="row items-center justify-around q-pa-md">
        <q-item class="col-12">
          <q-item-section class="col-7">
            {{$t('KLayerStyleForm.DEFAULT_POLYGON_FILL_STYLE')}}
          </q-item-section>
          <q-item-section class="col-1">
            <q-btn id="style-polygon-color" round small :color="defaultPolygon['fill-color']" @click="onColorClicked(defaultPolygon, 'fill-color')">
            </q-btn>
          </q-item-section>
          <q-item-section class="col-2">
            <q-slider id="style-fill-opacity" v-model="defaultPolygon['fill-opacity']"
              :min="0" :max="1" :step="0.1"
              label label-always :label-value="$t('KLayerStyleForm.POLYGON_FILL_OPACITY') + defaultPolygon['fill-opacity']"/>
          </q-item-section>
        </q-item>
        <q-item v-if="hasFeatureSchema" v-for="polygonStyle in polygonStyles" :key="polygonStyle.key" class="col-12">
          <q-item-section avatar class="col-3">
            <q-select v-if="polygonStyle.operator" v-model="polygonStyle.operator" :label="polygonStyle.property" stack-label :options="getOperators(polygonStyle)" emit-value map-options/>
          </q-item-section>
          <q-item-section class="col-4">
            <component
              :is="polygonStyle.component"
              :ref="polygonStyle.onComponentCreated"
              :properties="polygonStyle.properties"
              :display="{ icon: false, label: false }"
              @field-changed="polygonStyle.onValueChanged"
            />
          </q-item-section>
          <q-item-section class="col-1">
            <q-btn round small :color="polygonStyle['fill-color']" @click="onColorClicked(polygonStyle, 'fill-color')">
            </q-btn>
          </q-item-section>
          <q-item-section class="col-2">
            <q-slider v-model="polygonStyle['fill-opacity']"
              :min="0" :max="1" :step="0.1"
              label label-always :label-value="$t('KLayerStyleForm.POLYGON_FILL_OPACITY') + polygonStyle['fill-opacity']"/>
          </q-item-section>
          <q-item-section avatar>
            <q-btn flat color="primary" icon="las la-trash" @click="onRemovePolygonStyle(polygonStyle)">
              <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">
                {{$t('KLayerStyleForm.REMOVE_POLYGON_STYLE')}}
              </q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
        <q-item v-if="hasFeatureSchema" class="col-12">
          <q-item-section avatar class="col-6 text-left">
            {{$t('KLayerStyleForm.ADD_POLYGON_STYLE')}}
          </q-item-section>
          <q-item-section class="col-6">
            <q-select v-model="property" :options="properties">
              <template v-slot:after>
                <q-btn v-if="property" round dense flat icon="las la-plus" @click="onAddPolygonStyle(property)"/>
              </template>
            </q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-expansion-item v-if="hasFeatureSchema" ref="popup" id="style-popup-group" icon="las la-comment-alt" :label="$t('KLayerStyleForm.POPUP')" group="group">
      <q-list dense class="row items-center justify-around q-pa-md">

        <q-item class="col-12">
          <q-item-section class="col-1">
            <q-toggle id="style-toggle-popup" v-model="popup"/>
          </q-item-section>
          <q-item-section class="col-11">
            <q-select
              for="style-popup-field"
              :disable="!popup"
              use-chips
              v-model="popupProperties"
              multiple
              :options="properties"
              :label="$t('KLayerStyleForm.ADD_POPUP')"
            >
              <!-- Options display -->
              <template v-slot:option="scope">
                <q-item
                  :id="getPopupId(scope.opt)"
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
                >
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-expansion-item v-if="hasFeatureSchema" ref="tooltip" id="style-tooltip-group" icon="las la-mouse-pointer" :label="$t('KLayerStyleForm.TOOLTIP')" group="group">
      <q-list dense class="row items-center justify-around q-pa-md">
        <q-item class="col-12">
          <q-item-section class="col-1">
            <q-toggle id="style-toggle-tooltip" v-model="tooltip"/>
          </q-item-section>
          <q-item-section class="col-11">
            <q-select
              for="style-tooltip-field"
              :disable="!tooltip"
              v-model="tooltipProperty"
              :options="properties"
              :label="$t('KLayerStyleForm.ADD_TOOLTIP')"
            >
              <!-- Options display -->
              <template v-slot:option="scope">
                <q-item
                  :id="getPopupId(scope.opt)"
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
                >
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-expansion-item v-if="hasFeatureSchema" ref="infobox" id="style-infobox-group" icon="las la-th-list" :label="$t('KLayerStyleForm.INFOBOX')" group="group">
      <q-list dense class="row items-center justify-around q-pa-md">
        <q-item class="col-12">
          <q-item-section class="col-1">
            <q-toggle id="style-toggle-infobox" v-model="infobox"/>
          </q-item-section>
          <q-item-section class="col-11">
            <q-select
              for="style-infobox-field"
              :disable="!infobox"
              use-chips
              v-model="infoboxProperties"
              multiple
              :options="properties"
              :label="$t('KLayerStyleForm.ADD_INFOBOX')"
            >
              <!-- Options display -->
              <template v-slot:option="scope">
                <q-item
                  :id="getPopupId(scope.opt)"
                  v-bind="scope.itemProps"
                  v-on="scope.itemEvents"
                >
                  <q-item-section>
                    <q-item-label>{{ scope.opt.label }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-list v-show="hasError" dense class="row items-center justify-around q-pa-md">
      <q-item>
        <q-item-section side>
          <q-icon name="las la-exclamation-circle" color="negative" />
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
import { uid } from 'quasar'
import { mixins as kCoreMixins, utils as kCoreUtils } from '../../../core/client'
import { KIconChooser, KColorChooser } from '../../../core/client/components'

export default {
  name: 'k-layer-style-form',
  components: {
    KIconChooser,
    KColorChooser
  },
  emits: [
    'form-ready'
  ],
  mixins: [
    kCoreMixins.schemaProxy
  ],
  props: {
    layer: { type: Object, required: true },
    options: { type: Object, required: true } // Contains default style options
  },
  computed: {
    hasFeatureSchema () {
      return _.has(this.layer, 'schema')
    },
    isVectorLayer () {
      return this.hasFeatureSchema || (_.get(this.layer, 'leaflet.type') === 'geoJson')
    },
    fields () {
      // Avoid modifying the layer schema as we might update it internally
      return _.cloneDeep(_.get(this.layer, 'schema.content.properties', {}))
    },
    properties () {
      const properties = []
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
      isSelectable: true,
      hasOpacity: false,
      opacity: 0.5,
      popup: false,
      popupProperties: [],
      tooltip: false,
      tooltipProperty: null,
      infobox: false,
      infoboxProperties: [],
      clustering: true,
      disableClusteringAtZoom: 18,
      // Required to detail style properties upfront for reactivity
      defaultIcon: {
        'marker-color': 'blue',
        'icon-classes': 'fas fa-circle'
      },
      iconStyles: [],
      defaultLine: {
        'stroke-color': 'red',
        'stroke-width': 3,
        'stroke-opacity': 1
      },
      lineStyles: [],
      defaultPolygon: {
        'fill-color': 'green',
        'fill-opacity': 1
      },
      polygonStyles: [],
      hasError: false,
      error: ''
    }
  },
  methods: {
    getPopupId (option) {
      return _.kebabCase(option.label)
    },
    async build () {
      logger.debug('Building layer style form')
      // Since some properties are injected in form we need to make sure Vue.js has processed props
      // This could be done externally but adding it here we ensure no one will forget it
      await this.$nextTick()
      this.hasError = false
      this.property = this.properties[0]
    },
    async createStyle (property, options = {}) {
      // Retrieve schema descriptor
      const properties = this.fields[property]
      let componentName = properties.field.component
      // We previously directly used the component type from the schema but now we prefer
      // to switch to a select field in order to provide list of possible values for discrete types
      // if possible (not for eg in-memory layers, WFS, etc.)
      if ((componentName !== 'form/KNumberField') && _.has(this.layer, 'service')) {
        componentName = 'form/KSelectField'
        // Get available values
        let values = await this.$api.getService(_.get(this.layer, 'service'), this.contextId)
          .find({ query: Object.assign({ $distinct: `properties.${property}` }, this.layer.baseQuery) })
        // Sort them to ease searching
        values = values.sort()
        // We don't have label in that case
        properties.field.options = values.map(value => ({ value, label: (_.isNil(value) ? 'NIL' : value) }))
      }
      // Remove label as we add it on top of the operator
      properties.field.helper = ''
      // Load the required component
      const component = kCoreUtils.loadComponent(componentName)
      const style = {
        key: uid().toString(),
        component,
        componentName,
        operator: '===',
        property,
        properties,
        onComponentCreated: (ref) => { if (ref) ref.fill(style.value) },
        onValueChanged: (field, value) => { style.value = value }
      }
      return Object.assign(style, options)
    },
    getOperators (style) {
      let operators = [{
        label: this.$t('KLayerStyleForm.EQUAL'),
        value: '==='
      }, {
        label: this.$t('KLayerStyleForm.NOT_EQUAL'),
        value: '!=='
      }]
      if (style.componentName === 'form/KNumberField') {
        operators = operators.concat([{
          label: this.$t('KLayerStyleForm.GREATER_THAN'),
          value: '>'
        }, {
          label: this.$t('KLayerStyleForm.LOWER_THAN'),
          value: '<'
        }])
      }
      return operators
    },
    async processTemplates (values, properties, defaultStyle, styles) {
      // We have styles for a set of feature property values templated using if statements
      // For instance if I want all linear features with property 'A' equals 'V' to be green,
      // all linear features with property 'B' equals 'U' to be red, and all others to be blue (default style),
      // the 'stroke' style property value once converted to template will be the following:
      // if (properties.A === "V") { %>#00FF00<% } else
      // if (properties.B === "U") { %>#FF0000<% } else
      // { %>#0000FF<% }

      // First split after the last else statement to get default style values, then split after each if/else statement
      // We will have an array of template statements, actually one for each style property (i.e. stroke-width, marker-color, etc.)
      const templates = {}
      properties.forEach((property, index) => {
        const templateStatements = _.get(values, `leaflet.${property}`).split('} else {')
        templates[property] = templateStatements[0].split(' else ').concat(templateStatements[1])
      })
      // Process default style values
      properties.forEach((property) => {
        // Default style value is contained in the last template statement
        let template = templates[property].pop()
        // Extract it using a regex
        template = template.match(/%>([^<%]+)<%/)[1]
        // Conversion from palette to RGB color is required
        const value = (property.includes('color') ? kCoreUtils.getPaletteFromColor(template) : template)
        // Convert to number whenever required
        if (property.includes('width') || property.includes('opacity')) {
          defaultStyle[property] = _.toNumber(value)
        } else {
          defaultStyle[property] = value
        }
      })
      // Then process all templated if statements
      // As all templates have the same conditional structure use the first template to extract property values
      const templatesStructure = templates[properties[0]]
      for (let index = 0; index < templatesStructure.length; index++) {
        const template = templatesStructure[index]
        // Identify used operator first
        const operators = ['===', '!==', '>', '<']
        const operator = _.find(operators, operator => template.includes(` ${operator} `))
        // Match properties + operator to get property name part
        const propertyNameRegex = new RegExp(`properties.([^${operator}]+)${operator}`, 'g')
        let propertyName = propertyNameRegex.exec(template)[1].trim()
        const isNumber = !propertyName.includes('.toString()')
        propertyName = propertyName.replace('.toString()', '')
        // Split at operator
        let propertyValue = template.split(` ${operator} `)[1]
        // Match until last parenthesis of the if expression to get property value part
        propertyValue = propertyValue.slice(0, propertyValue.indexOf(')'))
        // Omit enclosing quotes for strings
        propertyValue = propertyValue.replaceAll('"', '').trim()
        if (isNumber) propertyValue = _.toNumber(propertyValue)
        let style = { value: propertyValue, operator }
        properties.forEach(property => {
          // Match %> <% block to get style values, e.g. icon colors/names
          const match = /%>([^<%]+)<%/g.exec(templates[property][index])
          const value = (match ? match[1].trim() : '')
          // Conversion from palette to RGB color is required
          style[property] = (property.includes('color')
            ? kCoreUtils.getPaletteFromColor(value)
            : (_.isNumber(value) ? Number(value) : value))
        })
        style = await this.createStyle(propertyName, style)
        styles.push(style)
      }
    },
    generateTemplates (properties, defaultStyle, styles) {
      const hasStyles = (styles.length > 0)
      const values = {}
      const templates = properties.map(property => '')
      // Process all styles, a style is a matching feature property value associated with a style property values.
      // It is expressed as a if statement in the final template expression of the style property.
      // For instance if I want all linear features with property 'A' equals 'V' to be green,
      // all linear features with property 'B' equals 'U' to be red, and all others to be blue (default style),
      // the 'stroke' style property value once converted to template will be the following:
      // if (properties.A === "V") { %>#00FF00<% } else
      // if (properties.B === "U") { %>#FF0000<% } else
      // { %>#0000FF<% }
      styles.forEach(style => {
        // Process all properties, for each property
        properties.forEach((property, index) => {
          // Conversion from palette to RGB color is required
          const value = (property.includes('color')
            ? kCoreUtils.getColorFromPalette(style[property])
            : style[property])
          let propertyName = style.property
          let propertyValue = style.value
          const propertyOperator = style.operator
          if (typeof propertyValue !== 'number') {
            propertyName = `${propertyName}.toString()`
            propertyValue = `"${propertyValue}"`
          }
          // Generate style value for given property value
          templates[index] += `if (properties.${propertyName} ${propertyOperator} ${propertyValue}) { %>${value}<% } else `
        })
      })
      // Process default style for each style property
      // If there are some styles based on feature property values it will be the last else statement
      // otherwise it will simply be the sole value in the template expression
      properties.forEach((property, index) => {
        // Conversion from palette to RGB color is required
        const value = (property.includes('color')
          ? kCoreUtils.getColorFromPalette(defaultStyle[property])
          : defaultStyle[property])
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
    fillBaseStyle (values) {
      this.isVisible = _.get(values, 'leaflet.isVisible', true)
      this.hasMinZoom = !!_.get(values, 'leaflet.minZoom')
      if (this.hasMinZoom) this.minZoom = _.get(values, 'leaflet.minZoom')
      this.hasMaxZoom = !!_.get(values, 'leaflet.maxZoom')
      if (this.hasMaxZoom) this.maxZoom = _.get(values, 'leaflet.maxZoom')
      this.hasOpacity = _.has(values, 'leaflet.opacity')
      if (this.hasOpacity) this.opacity = _.get(values, 'leaflet.opacity')
      this.isSelectable = _.get(values, 'isSelectable', true)
    },
    fillClusteringStyle (values) {
      this.clustering = (!!_.get(values, 'leaflet.cluster', _.get(this.options, 'cluster')))
      this.disableClusteringAtZoom = _.get(values, 'leaflet.cluster.disableClusteringAtZoom',
        _.get(this.options, 'cluster.disableClusteringAtZoom', 18))
    },
    async fillIconStyles (values) {
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
        await this.processTemplates(values, ['marker-color', 'icon-classes'], this.defaultIcon, this.iconStyles)
      }
    },
    async fillLineStyles (values) {
      this.lineStyles = []
      const templates = _.get(values, 'leaflet.template', [])
      // When no template we have a single default style
      if (!templates.includes('stroke-color') && !templates.includes('stroke-width') && !templates.includes('stroke-opacity')) {
        // Conversion from palette to RGB color is required for path style
        this.defaultLine['stroke-color'] = kCoreUtils.getPaletteFromColor(_.get(values, 'leaflet.stroke-color',
          kCoreUtils.getColorFromPalette(_.get(this.options, 'featureStyle.color'), 'red')))
        this.defaultLine['stroke-width'] = _.get(values, 'leaflet.stroke-width',
          _.get(this.options, 'featureStyle.weight', 3))
        this.defaultLine['stroke-opacity'] = _.get(values, 'leaflet.stroke-opacity',
          _.get(this.options, 'featureStyle.opacity', 1))
      } else {
        await this.processTemplates(values, ['stroke-color', 'stroke-width', 'stroke-opacity'], this.defaultLine, this.lineStyles)
      }
    },
    async fillPolygonStyles (values) {
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
        await this.processTemplates(values, ['fill-color', 'fill-opacity'], this.defaultPolygon, this.polygonStyles)
      }
    },
    async fillPopupStyles (values) {
      // Check for popup in layer and default style
      this.popup = (!!_.get(values, 'leaflet.popup', _.get(this.options, 'popup')))
      this.popupProperties = _.get(values, 'leaflet.popup.pick',
        _.get(this.options, 'popup.pick', this.properties.map(property => property.value)))
      // Jump to select data model
      if (!_.isEmpty(this.popupProperties)) {
        this.popupProperties = this.popupProperties.map(property =>
          _.find(this.properties, { value: property })
        )
      } else { // Empty list of properties is similar to no popup
        this.popup = false
      }
    },
    async fillTooltipStyles (values) {
      // Check for tooltip in layer and default style
      this.tooltip = (!!_.get(values, 'leaflet.tooltip', _.get(this.options, 'tooltip')))
      this.tooltipProperty = _.get(values, 'leaflet.tooltip.property',
        _.get(this.options, 'tooltip.property', null))
      // Jump to select data model
      if (this.tooltipProperty) {
        this.tooltipProperty = _.find(this.properties, { value: this.tooltipProperty })
      } else { // No property is similar to no popup
        this.tooltip = false
      }
    },
    async fillInfoBoxStyles (values) {
      // Check for infobox in layer and default style
      this.infobox = (!!_.get(values, 'leaflet.infobox', _.get(this.options, 'infobox')))
      this.infoboxProperties = _.get(values, 'leaflet.infobox.pick',
        _.get(this.options, 'infobox.pick', this.properties.map(property => property.value)))
      // Jump to select data model
      if (!_.isEmpty(this.infoboxProperties)) {
        this.infoboxProperties = this.infoboxProperties.map(property =>
          _.find(this.properties, { value: property })
        )
      } else { // Empty list of properties is similar to no popup
        this.infobox = false
      }
    },
    async fill (values) {
      logger.debug('Filling layer style form', values)
      // Base style
      this.fillBaseStyle(values)
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
    baseValues () {
      const values = {
        'leaflet.isVisible': this.isVisible,
        // See https://github.com/kalisio/kdk/issues/429
        // While we cannot edit style in 3D make at least visibility available
        'cesium.isVisible': this.isVisible,
        isSelectable: this.isSelectable
      }
      values['leaflet.minZoom'] = (this.hasMinZoom ? this.minZoom : false)
      values['leaflet.maxZoom'] = (this.hasMaxZoom ? this.maxZoom : false)
      if (this.hasOpacity) values['leaflet.opacity'] = this.opacity
      return values
    },
    clusteringValues () {
      return {
        'leaflet.cluster': (this.clustering ? { disableClusteringAtZoom: this.disableClusteringAtZoom } : false)
      }
    },
    iconStylesValues () {
      const values = this.generateTemplates(['marker-color', 'icon-classes'], this.defaultIcon, this.iconStyles)
      values['leaflet.icon-color'] = '#FFFFFF'
      return values
    },
    lineStylesValues () {
      return this.generateTemplates(['stroke-color', 'stroke-width', 'stroke-opacity'], this.defaultLine, this.lineStyles)
    },
    polygonStylesValues () {
      return this.generateTemplates(['fill-color', 'fill-opacity'], this.defaultPolygon, this.polygonStyles)
    },
    popupStylesValues () {
      return {
        'leaflet.popup': (this.popup ? { pick: this.popupProperties.map(property => property.value) } : false)
      }
    },
    tooltipStylesValues () {
      return {
        'leaflet.tooltip': (this.tooltip ? { property: this.tooltipProperty.value } : false)
      }
    },
    infoBoxStylesValues () {
      return {
        'leaflet.infobox': (this.infobox ? { pick: this.infoboxProperties.map(property => property.value) } : false)
      }
    },
    values () {
      const values = {}
      // Be default lodash merges objects only not arrays
      // As the template style property is one we need this
      const customizer = (objValue, srcValue) => {
        if (_.isArray(objValue)) return objValue.concat(srcValue)
      }
      // Base properties
      _.merge(values, this.baseValues())
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
    async onAddIconStyle (property) {
      // Default icon
      let color = _.get(this.options, 'pointStyle.icon.options.markerColor')
      if (color) color = kCoreUtils.getPaletteFromColor(color)
      const style = await this.createStyle(property.value, {
        'icon-classes': _.get(this.options, 'pointStyle.icon.options.iconClasses', 'fas fa-circle'),
        'marker-color': color || 'blue'
      })
      this.iconStyles.push(style)
    },
    onRemoveIconStyle (style) {
      // Required to update the array to make it reactive
      this.iconStyles = this.iconStyles.filter(item => item.key !== style.key)
    },
    onIconClicked (style) {
      this.editedStyle = style
      this.$refs.iconChooser.open({
        name: style['icon-classes'],
        color: style['marker-color']
      })
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
    async onAddLineStyle (property) {
      const style = await this.createStyle(property.value, {
        // Default line
        'stroke-color': _.get(this.options, 'featureStyle.color', 'red'),
        'stroke-width': _.get(this.options, 'featureStyle.weight', 1),
        'stroke-opacity': _.get(this.options, 'featureStyle.opacity', 1)
      })
      this.lineStyles.push(style)
    },
    onRemoveLineStyle (style) {
      // Required to update the array to make it reactive
      this.lineStyles = this.lineStyles.filter(item => item.key !== style.key)
    },
    async onAddPolygonStyle (property) {
      const style = await this.createStyle(property.value, {
        // Default line
        'fill-color': _.get(this.options, 'featureStyle.fillColor', 'green'),
        'fill-opacity': _.get(this.options, 'featureStyle.fillOpacity', 1)
      })
      this.polygonStyles.push(style)
    },
    onRemovePolygonStyle (style) {
      // Required to update the array to make it reactive
      this.polygonStyles = this.polygonStyles.filter(item => item.key !== style.key)
    }
  },
  async created () {
    this.minViewerZoom = this.minZoom = _.get(this.options, 'viewer.minZoom', 1)
    this.maxViewerZoom = this.maxZoom = _.get(this.options, 'viewer.maxZoom', 18)
    await this.build()
    this.$emit('form-ready', this)
  }
}
</script>
