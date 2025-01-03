<template>
  <div>
    <k-icon-chooser ref="iconChooser" @icon-choosed="onIconChanged" />
    <k-color-chooser ref="colorChooser" @color-choosed="onColorChanged" />
    <q-expansion-item id="style-general-group" default-opened icon="las la-low-vision" :label="$t('KLayerStyleForm.BASE')" group="group">
      <q-list dense class="q-pa-md">
        <q-item class="row justify-start">
          <q-item-section class="col-1"><q-toggle v-model="isVisible"/></q-item-section>
          <q-item-section>{{$t('KLayerStyleForm.DEFAULT_VISIBILITY')}}</q-item-section>
        </q-item>
        <q-item v-if="!is3D" class="row justify-start">
          <q-item-section class="col-1"><q-toggle id="style-toggle-minzoom" v-model="hasMinZoom"/></q-item-section>
          <q-item-section avatar>{{$t('KLayerStyleForm.MIN_ZOOM')}}&nbsp;&nbsp;&nbsp;&nbsp;</q-item-section>
          <q-item-section class="col-2">
            <q-slider id="style-set-minzoom" v-model="minZoom" :disable="!hasMinZoom"
              :min="minViewerZoom" :max="hasMaxZoom ? maxZoom : maxViewerZoom" :step="1"
              label label-always :label-value="minZoom"/>
          </q-item-section>
        </q-item>
        <q-item v-if="!is3D" class="row justify-start">
          <q-item-section class="col-1"><q-toggle id="style-toggle-maxzoom" v-model="hasMaxZoom"/></q-item-section>
          <q-item-section avatar>{{$t('KLayerStyleForm.MAX_ZOOM')}}&nbsp;&nbsp;&nbsp;&nbsp;</q-item-section>
          <q-item-section class="col-2">
            <q-slider id="style-set-maxzoom" v-model="maxZoom" :disable="!hasMaxZoom"
              :min="hasMinZoom ? minZoom : minViewerZoom" :max="maxViewerZoom" :step="1"
              label label-always :label-value="maxZoom"/>
          </q-item-section>
        </q-item>
        <q-item class="row justify-start">
          <q-item-section class="col-1"><q-toggle id="style-toggle-clustering" v-model="clustering"/></q-item-section>
          <q-item-section avatar>{{$t('KLayerStyleForm.CLUSTERING_PIXEL_RANGE')}}&nbsp;&nbsp;&nbsp;&nbsp;</q-item-section>
          <q-item-section class="col-2">
            <q-slider v-if="!is3D" id="style-set-clustering" v-model="disableClusteringAtZoom" :disable="!clustering"
              :min="minViewerZoom" :max="maxViewerZoom" :step="1"
              label label-always :label-value="disableClusteringAtZoom"/>
            <q-slider v-else id="style-set-clustering" v-model="clusteringPixelRange" :disable="!clustering"
              :min="5" :max="200" :step="1"
              label label-always :label-value="clusteringPixelRange + 'px'"/>
          </q-item-section>
        </q-item>
        <q-item class="row justify-start" v-if="isVectorLayer">
          <q-item-section class="col-1"><q-toggle id="style-is-selectable" v-model="isSelectable"/></q-item-section>
          <q-item-section avatar>{{$t('KLayerStyleForm.SELECTABLE')}}</q-item-section>
        </q-item>
        <q-item v-if="!hasFeatureSchema" class="row justify-start">
          <q-item-section class="col-1"><q-toggle v-model="hasOpacity"/></q-item-section>
          <q-item-section avatar>{{$t('KLayerStyleForm.LAYER_OPACITY')}}&nbsp;&nbsp;&nbsp;&nbsp;</q-item-section>
          <q-item-section class="col-2">
            <q-slider v-model="opacity" :disable="!hasOpacity"
              :min="0" :max="1" :step="0.1"
              label label-always :label-value="$t('KLayerStyleForm.OPACITY') + ' ' + opacity"/>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-expansion-item v-if="isVectorLayer && !is3D" id="style-point-group" icon="las la-map-marker-alt" :label="$t('KLayerStyleForm.POINTS')" group="group">
      <q-list dense class="q-pa-md">
        <q-item class="row justify-start">
          <q-item-section avatar>{{$t('KLayerStyleForm.DEFAULT_ICON_STYLE')}}</q-item-section>
          <q-item-section avatar><q-avatar id="style-point-icon" :text-color="defaultPoint['icon.color']" :icon="defaultPoint['icon.classes'] || 'fas fa-circle'"
            :color="defaultPoint['icon.color'] === 'white' ? 'dark' : 'white'" @click="onIconClicked(defaultPoint)"/></q-item-section>
          <q-item-section class="col-1"><q-select id="style-icon-size" :label="$t('KLayerStyleForm.ICON_SIZE')" hide-dropdown-icon v-model="defaultPoint['icon.size']" dense :options="getSizes()" emit-value map-options/>
          </q-item-section>
          <q-item-section avatar>{{$t('KLayerStyleForm.DEFAULT_POINT_STYLE')}}&nbsp;&nbsp;</q-item-section>
          <q-item-section avatar><q-btn id="style-point-color" round style="max-width: 16px" :color="defaultPoint['color']" @click="onColorClicked(defaultPoint, 'color')"/></q-item-section>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <q-item-section class="col-1"><q-select id="style-point-size" :label="$t('KLayerStyleForm.POINT_SIZE')" hide-dropdown-icon v-model="defaultPoint.size" dense :options="getSizes()" emit-value map-options/>
          </q-item-section>
          <q-item-section avatar><q-select id="style-point-shape" :label="$t('KLayerStyleForm.POINT_SHAPE')" hide-dropdown-icon v-model="defaultPoint.shape" dense :options="getShapes()" emit-value map-options bottom-slots>
            <template v-slot:selected-item="scope"><KShape :options="scope.opt"/></template>
            <template v-slot:option="scope"><KShape class="row justify-center" v-bind="scope.itemProps" :options="scope.opt"/></template>
          </q-select></q-item-section>
        </q-item>
        <q-item v-if="hasFeatureSchema" v-for="iconStyle in iconStyles" :key="iconStyle.key" class="row justify-start">
          <q-item-section avatar><q-btn flat round color="primary" icon="las la-trash" @click="onRemoveIconStyle(iconStyle)">
            <q-tooltip>{{$t('KLayerStyleForm.REMOVE_POINT_STYLE')}}</q-tooltip></q-btn>
          </q-item-section>
          <q-item-section avatar>{{$t('KLayerStyleForm.PROPERTY_ICON_STYLE')}}</q-item-section>
          <q-item-section avatar><q-avatar :text-color="iconStyle['icon.color']" :icon="iconStyle['icon.classes']" color="white" @click="onIconClicked(iconStyle)"/></q-item-section>
          <q-item-section class="col-1"><q-select :label="$t('KLayerStyleForm.ICON_SIZE')" hide-dropdown-icon v-model="iconStyle['icon.size']" dense :options="getSizes()" emit-value map-options/>
          </q-item-section>
          <q-item-section avatar>{{$t('KLayerStyleForm.PROPERTY_POINT_STYLE')}}&nbsp;&nbsp;</q-item-section>
          <q-item-section avatar><q-btn round style="max-width: 16px" :color="iconStyle['color']" @click="onColorClicked(iconStyle, 'color')"></q-btn></q-item-section>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <q-item-section class="col-1"><q-select id="style-point-size" :label="$t('KLayerStyleForm.POINT_SIZE')" hide-dropdown-icon v-model="iconStyle.size" dense :options="getSizes()" emit-value map-options/>
          </q-item-section>
          <q-item-section avatar><q-select id="style-point-shape" :label="$t('KLayerStyleForm.POINT_SHAPE')" hide-dropdown-icon v-model="iconStyle.shape" dense :options="getShapes()" emit-value map-options bottom-slots>
            <template v-slot:selected-item="scope"><KShape :options="scope.opt"/></template>
            <template v-slot:option="scope"><KShape class="row justify-center" v-bind="scope.itemProps" :options="scope.opt"/></template>
          </q-select></q-item-section>
          <q-item-section class="col-2"><q-select v-if="iconStyle.operator" v-model="iconStyle.operator" dense :options="getOperators(iconStyle)" emit-value map-options>
              <template v-slot:prepend><span class="text-body2">{{$t('KLayerStyleForm.WHEN_PROPERTY_IS_POINT_STYLE', { property: iconStyle.property })}}</span></template></q-select>
          </q-item-section>
          <q-item-section><component :is="iconStyle.component" :ref="iconStyle.onComponentCreated" :properties="iconStyle.properties" @field-changed="iconStyle.onValueChanged"/>
          </q-item-section>
        </q-item>
        <q-item v-if="hasFeatureSchema" class="row justify-start">
          <q-item-section class="col-6">
            <q-select v-model="property" :options="properties">
              <template v-slot:prepend><span class="text-body2">{{$t('KLayerStyleForm.ADD_POINT_STYLE')}}</span></template>
              <template v-slot:before><q-btn v-if="property" round dense flat icon="las la-plus" @click="onAddIconStyle(property)"/></template>
            </q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-expansion-item v-if="isVectorLayer" id="style-line-group" icon="las la-grip-lines" :label="$t('KLayerStyleForm.LINES')" group="group">
      <q-list dense class="q-pa-md">
        <q-item class="row justify-start">
          <q-item-section avatar>{{$t('KLayerStyleForm.DEFAULT_LINE_STYLE')}}&nbsp;&nbsp;</q-item-section>
          <q-item-section class="col-1"><q-slider id="style-line-width" v-model="defaultLine['width']" :min="1" :max="20" :step="1"
              dense label label-always :label-value="$t('KLayerStyleForm.LINE_WIDTH') + defaultLine['width'] + 'px'"/>
          </q-item-section>
          <q-item-section class="col-1"><q-slider id="style-line-opacity" v-model="defaultLine['opacity']" :min="0" :max="1" :step="0.1"
              label label-always :label-value="$t('KLayerStyleForm.LINE_OPACITY') + defaultLine['opacity']"/>
          </q-item-section>
          <q-item-section class="col-1"><q-btn id="style-line-color" round style="max-width: 16px" :color="defaultLine['color']" @click="onColorClicked(defaultLine, 'color')"/></q-item-section>
        </q-item>
        <q-item v-if="hasFeatureSchema" v-for="lineStyle in lineStyles" :key="lineStyle.key" class="row justify-start">
          <q-item-section avatar><q-btn flat round color="primary" icon="las la-trash" @click="onRemoveLineStyle(lineStyle)">
            <q-tooltip>{{$t('KLayerStyleForm.REMOVE_LINE_STYLE')}}</q-tooltip></q-btn>
          </q-item-section>
          <q-item-section avatar>{{$t('KLayerStyleForm.PROPERTY_LINE_STYLE')}}</q-item-section>
          <q-item-section class="col-1"><q-slider v-model="lineStyle['width']" :min="1" :max="20" :step="1"
              label label-always :label-value="$t('KLayerStyleForm.LINE_WIDTH') + lineStyle['width'] + 'px'"/>
          </q-item-section>
          <q-item-section class="col-1"><q-slider v-model="lineStyle['opacity']" :min="0" :max="1" :step="0.1"
              label label-always :label-value="$t('KLayerStyleForm.LINE_OPACITY') + lineStyle['opacity']"/>
          </q-item-section>
          <q-item-section class="col-1"><q-btn round style="max-width: 16px" :color="lineStyle['color']" @click="onColorClicked(lineStyle, 'color')"/></q-item-section>
          <q-item-section class="col-2"><q-select v-if="lineStyle.operator" v-model="lineStyle.operator" dense :options="getOperators(lineStyle)" emit-value map-options>
              <template v-slot:prepend><span class="text-body2">{{$t('KLayerStyleForm.WHEN_PROPERTY_IS_LINE_STYLE', { property: lineStyle.property })}}</span></template></q-select>
          </q-item-section>
          <q-item-section class="col-5"><component :is="lineStyle.component" :ref="lineStyle.onComponentCreated" :properties="lineStyle.properties" @field-changed="lineStyle.onValueChanged"/>
          </q-item-section>
        </q-item>
        <q-item v-if="hasFeatureSchema" class="row justify-start">
          <q-item-section class="col-6">
            <q-select v-model="property" :options="properties">
              <template v-slot:prepend><span class="text-body2">{{$t('KLayerStyleForm.ADD_LINE_STYLE')}}</span></template>
              <template v-slot:before><q-btn v-if="property" round dense flat icon="las la-plus" @click="onAddLineStyle(property)"/></template>
            </q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-expansion-item v-if="isVectorLayer" id="style-polygon-group" icon="las la-draw-polygon" :label="$t('KLayerStyleForm.POLYGONS')" group="group">
      <q-list dense class="q-pa-md">
        <q-item class="row justify-start">
          <q-item-section avatar>{{$t('KLayerStyleForm.DEFAULT_POLYGON_LINE_STYLE')}}&nbsp;&nbsp;</q-item-section>
          <q-item-section class="col-1"><q-slider id="style-polygon-line-width" v-model="defaultPolygon['stroke.width']" :min="1" :max="20" :step="1"
              label label-always :label-value="$t('KLayerStyleForm.POLYGON_LINE_WIDTH') + defaultPolygon['stroke.width'] + 'px'"/>
          </q-item-section>
          <q-item-section class="col-1"><q-slider id="style-polygon-line-opacity" v-model="defaultPolygon['stroke.opacity']" :min="0" :max="1" :step="0.1"
              label label-always :label-value="$t('KLayerStyleForm.POLYGON_LINE_OPACITY') + defaultPolygon['stroke.opacity']"/>
          </q-item-section>
          <q-item-section class="col-1"><q-btn id="style-polygon-line-color" round style="max-width: 16px" :color="defaultPolygon['stroke.color']" @click="onColorClicked(defaultPolygon, 'stroke.color')"/>
          </q-item-section>
          <q-item-section avatar>{{$t('KLayerStyleForm.DEFAULT_POLYGON_FILL_STYLE')}}&nbsp;&nbsp;</q-item-section>
          <q-item-section class="col-1"><q-slider id="style-polygon-opacity" v-model="defaultPolygon['opacity']" :min="0" :max="1" :step="0.1"
              label label-always :label-value="$t('KLayerStyleForm.POLYGON_FILL_OPACITY') + defaultPolygon['opacity']"/>
          </q-item-section>
          <q-item-section class="col-1"><q-btn id="style-polygon-color" round style="max-width: 16px" :color="defaultPolygon['color']" @click="onColorClicked(defaultPolygon, 'color')"/>
          </q-item-section>
        </q-item>
        <q-item v-if="hasFeatureSchema" v-for="polygonStyle in polygonStyles" :key="polygonStyle.key" class="row justify-start">
          <q-item-section avatar><q-btn flat round color="primary" icon="las la-trash" @click="onRemovePolygonStyle(polygonStyle)">
            <q-tooltip>{{$t('KLayerStyleForm.REMOVE_POLYGON_STYLE')}}</q-tooltip></q-btn>
          </q-item-section>
          <q-item-section avatar>{{$t('KLayerStyleForm.PROPERTY_POLYGON_LINE_STYLE')}}</q-item-section>
          <q-item-section class="col-1"><q-slider v-model="polygonStyle['stroke.width']" :min="1" :max="20" :step="1"
              label label-always :label-value="$t('KLayerStyleForm.POLYGON_LINE_WIDTH') + polygonStyle['stroke.width'] + 'px'"/>
          </q-item-section>
          <q-item-section class="col-1"><q-slider v-model="polygonStyle['stroke.opacity']" :min="0" :max="1" :step="0.1"
              label label-always :label-value="$t('KLayerStyleForm.POLYGON_LINE_OPACITY') + polygonStyle['stroke.opacity']"/>
          </q-item-section>
          <q-item-section><q-btn round style="max-width: 16px" :color="polygonStyle['stroke.color']" @click="onColorClicked(polygonStyle, 'stroke.color')"/>
          </q-item-section>
          <q-item-section avatar>{{$t('KLayerStyleForm.PROPERTY_POLYGON_FILL_STYLE')}}&nbsp;&nbsp;</q-item-section>
          <q-item-section class="col-1"><q-slider v-model="polygonStyle['opacity']" :min="0" :max="1" :step="0.1"
              label label-always :label-value="$t('KLayerStyleForm.POLYGON_FILL_OPACITY') + polygonStyle['opacity']"/>
          </q-item-section>
          <q-item-section class="col-1"><q-btn round style="max-width: 16px" :color="polygonStyle['color']" @click="onColorClicked(polygonStyle, 'color')"/>
          </q-item-section>
          <q-item-section class="col-2"><q-select v-if="polygonStyle.operator" v-model="polygonStyle.operator" dense :options="getOperators(polygonStyle)" emit-value map-options>
              <template v-slot:prepend><span class="text-body2">{{$t('KLayerStyleForm.WHEN_PROPERTY_IS_POLYGON_STYLE', { property: polygonStyle.property })}}</span></template></q-select>
          </q-item-section>
          <q-item-section class="col-3"><component :is="polygonStyle.component" :ref="polygonStyle.onComponentCreated" :properties="polygonStyle.properties" @field-changed="polygonStyle.onValueChanged"/>
          </q-item-section>
        </q-item>
        <q-item v-if="hasFeatureSchema" class="row justify-start">
          <q-item-section class="col-6">
            <q-select v-model="property" :options="properties">
              <template v-slot:prepend><span class="text-body2">{{$t('KLayerStyleForm.ADD_POLYGON_STYLE')}}</span></template>
              <template v-slot:before><q-btn v-if="property" round dense flat icon="las la-plus" @click="onAddPolygonStyle(property)"/></template>
            </q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-expansion-item v-if="hasFeatureSchema && !is3D" ref="popup" id="style-popup-group" icon="las la-comment-alt" :label="$t('KLayerStyleForm.POPUP')" group="group">
      <q-list dense class="q-pa-md">
        <q-item class="row justify-start">
          <q-item-section class="col-1"><q-toggle id="style-toggle-popup" v-model="popup"/></q-item-section>
          <q-item-section class="col-6"><q-select for="style-popup-field" id="style-popup-field" :disable="!popup" use-chips
              v-model="popupProperties" multiple :options="properties" :label="$t('KLayerStyleForm.ADD_POPUP')">
              <!-- Options display -->
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" :id="getPopupId(scope.opt)">
                  <q-item-section> <q-item-label>{{ scope.opt.label }}</q-item-label> </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-expansion-item v-if="hasFeatureSchema" ref="tooltip" id="style-tooltip-group" icon="las la-mouse-pointer" :label="$t('KLayerStyleForm.TOOLTIP')" group="group">
      <q-list dense class="q-pa-md">
        <q-item class="row justify-start">
          <q-item-section class="col-1"><q-toggle id="style-toggle-tooltip" v-model="tooltip"/></q-item-section>
          <q-item-section class="col-6"><q-select for="style-tooltip-field" id="style-tooltip-field" :disable="!tooltip"
              v-model="tooltipProperty" :options="properties" :label="$t('KLayerStyleForm.ADD_TOOLTIP')">
              <!-- Options display -->
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" :id="getPopupId(scope.opt)" >
                  <q-item-section> <q-item-label>{{ scope.opt.label }}</q-item-label> </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-expansion-item v-if="hasFeatureSchema" ref="infobox" id="style-infobox-group" icon="las la-th-list" :label="$t('KLayerStyleForm.INFOBOX')" group="group">
      <q-list dense class="q-pa-md">
        <q-item class="row justify-start">
          <q-item-section class="col-1"><q-toggle id="style-toggle-infobox" v-model="infobox"/> </q-item-section>
          <q-item-section class="col-6"><q-select for="style-infobox-field" id="style-infobox-field" :disable="!infobox" use-chips
            v-model="infoboxProperties" multiple :options="properties" :label="$t('KLayerStyleForm.ADD_INFOBOX')" >
              <!-- Options display -->
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps" :id="getPopupId(scope.opt)" >
                  <q-item-section> <q-item-label>{{ scope.opt.label }}</q-item-label> </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>
    <q-list v-show="hasError" dense class="row items-center justify-around q-pa-md">
      <q-item>
        <q-item-section side> <q-icon name="las la-exclamation-circle" color="negative" /> </q-item-section>
        <q-item-section class="text-negative">{{error}} </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import { uid } from 'quasar'
import { mixins as kCoreMixins, utils as kCoreUtils } from '../../../core/client'
import { KIconChooser, KColorChooser, KShape } from '../../../core/client/components'
import { processStyleTemplates, generateStyleTemplates, DefaultStyle } from '../utils/utils.style.js'

export default {
  name: 'k-layer-style-form',
  components: {
    KIconChooser,
    KColorChooser,
    KShape
  },
  emits: [
    'form-ready'
  ],
  mixins: [
    kCoreMixins.schemaProxy
  ],
  props: {
    layer: { type: Object, required: true },
    options: { type: Object, required: true }, // Contains default style options
    is3D: { type: Boolean, default: false }
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
        // Use label or ID
        properties.push({
          label: _.get(value, 'field.label', key),
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
      clusteringPixelRange: 80,
      defaultPoint: {},
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
      properties.field.label = ''
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
    getSizes () {
      // From 8 to 64 by step of 8
      return Array(8).fill().map((_, i) => ({
        label: `${8 * i + 8}px`,
        value: 8 * i + 8
      }))
    },
    getShapes () {
      return ['none', 'circle', 'triangle-down', 'triangle', 'triangle-right', 'triangle-left', 'rect', 'diamond', 'star', 'marker-pin', 'square-pin']
        .map(shape => ({ value: shape, shape, size: 32, opacity: 0.1, color: 'primary', stroke: { color: 'primary', width: 2 } }))
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
    async processTemplates (values, properties, styleType, defaultStyle, styles) {
      processStyleTemplates(values.leaflet, properties, styleType, defaultStyle, styles)
      // Jump from style object to internal requirements for UI with additional component, etc.
      for (let i = 0; i < styles.length; i++) {
        styles[i] = await this.createStyle(styles[i].property, styles[i])
      }
    },
    fillBaseStyle (values) {
      this.isVisible = _.get(values, 'leaflet.isVisible', _.get(DefaultStyle, 'isVisible'))
      this.hasMinZoom = !!_.get(values, 'leaflet.minZoom')
      if (this.hasMinZoom) this.minZoom = _.get(values, 'leaflet.minZoom')
      this.hasMaxZoom = !!_.get(values, 'leaflet.maxZoom')
      if (this.hasMaxZoom) this.maxZoom = _.get(values, 'leaflet.maxZoom')
      this.hasOpacity = _.has(values, 'leaflet.opacity')
      if (this.hasOpacity) this.opacity = _.get(values, 'leaflet.opacity')
      this.isSelectable = _.get(values, 'isSelectable', _.get(DefaultStyle, 'isSelectable'))
    },
    fillClusteringStyle (values) {
      this.clustering = (!!_.get(values, (this.is3D ? 'cesium.cluster' : 'leaflet.cluster'), _.get(this.options, 'cluster')))
      this.disableClusteringAtZoom = _.get(values, 'leaflet.cluster.disableClusteringAtZoom',
        _.get(this.options, 'cluster.disableClusteringAtZoom', _.get(DefaultStyle, 'leaflet.cluster.disableClusteringAtZoom')))
      this.clusteringPixelRange = _.get(values, 'cesium.cluster.pixelRange',
        _.get(this.options, 'cluster.pixelRange', _.get(DefaultStyle, 'cesium.cluster.pixelRange')))
    },
    async fillIconStyles (values) {
      this.iconStyles = []
      const templates = _.get(values, 'leaflet.template', [])
      // When no template we have a single default icon
      if (!templates.includes('style.point.color')) {
        // Conversion from palette to RGB color is required for markers
        this.defaultPoint.color = kCoreUtils.getPaletteFromColor(
          _.get(values, 'leaflet.style.point.color',
            _.get(this.options, 'style.point.color', kCoreUtils.getColorFromPalette(_.get(DefaultStyle, 'point.color')))))
        this.defaultPoint.size = _.get(values, 'leaflet.style.point.size',
          _.get(this.options, 'style.point.size', _.get(DefaultStyle, 'point.size')))
        this.defaultPoint.shape = _.get(values, 'leaflet.style.point.shape',
          _.get(this.options, 'style.point.shape', _.get(DefaultStyle, 'point.shape')))
        this.defaultPoint['icon.classes'] =
          _.get(values, 'leaflet.style.point.icon.classes',
            _.get(this.options, 'style.point.icon.classes', _.get(DefaultStyle, 'point.icon.classes')))
        this.defaultPoint['icon.color'] = kCoreUtils.getPaletteFromColor(
          _.get(values, 'leaflet.style.point.icon.color',
            _.get(this.options, 'style.point.icon.color', kCoreUtils.getColorFromPalette(_.get(DefaultStyle, 'point.icon.color')))))
        this.defaultPoint['icon.size'] = _.get(values, 'leaflet.style.point.icon.size',
          _.get(this.options, 'style.point.icon.size', _.get(DefaultStyle, 'point.icon.size')))
      } else {
        await this.processTemplates(values, ['color', 'size', 'shape', 'icon.classes', 'icon.color', 'icon.size'], 'point', this.defaultPoint, this.iconStyles)
      }
    },
    async fillLineStyles (values) {
      this.lineStyles = []
      const templates = _.get(values, 'leaflet.template', [])
      // When no template we have a single default style
      if (!templates.includes('style.line.color')) {
        // Conversion from palette to RGB color is required for path style
        this.defaultLine.color = kCoreUtils.getPaletteFromColor(
          _.get(values, 'leaflet.style.line.color',
            _.get(this.options, 'style.line.color'), kCoreUtils.getColorFromPalette(_.get(DefaultStyle, 'line.color'))))
        this.defaultLine.width =
          _.get(values, 'leaflet.style.line.width',
            _.get(this.options, 'style.line.width', _.get(DefaultStyle, 'line.width')))
        this.defaultLine.opacity =
          _.get(values, 'leaflet.style.line.opacity',
            _.get(this.options, 'style.line.opacity', _.get(DefaultStyle, 'line.opacity')))
      } else {
        await this.processTemplates(values, ['color', 'width', 'opacity'], 'line', this.defaultLine, this.lineStyles)
      }
    },
    async fillPolygonStyles (values) {
      this.polygonStyles = []
      const templates = _.get(values, 'leaflet.template', [])
      // When no template we have a single default style
      if (!templates.includes('style.polygon.color')) {
        // Conversion from palette to RGB color is required for path style
        this.defaultPolygon.color = kCoreUtils.getPaletteFromColor(
          _.get(values, 'leaflet.style.polygon.color',
            _.get(this.options, 'style.polygon.color', kCoreUtils.getColorFromPalette(_.get(DefaultStyle, 'polygon.color')))))
        this.defaultPolygon.opacity =
          _.get(values, 'leaflet.style.polygon.opacity',
            _.get(this.options, 'style.polygon.opacity', _.get(DefaultStyle, 'polygon.opacity')))
        this.defaultPolygon['stroke.color'] = kCoreUtils.getPaletteFromColor(
          _.get(values, 'leaflet.style.polygon.stroke.color',
            _.get(this.options, 'style.polygon.stroke.color', kCoreUtils.getColorFromPalette(_.get(DefaultStyle, 'polygon.stroke.color')))))
        this.defaultPolygon['stroke.width'] =
          _.get(values, 'leaflet.style.polygon.stroke.width',
            _.get(this.options, 'style.polygon.stroke.width', _.get(DefaultStyle, 'polygon.stroke.width')))
        this.defaultPolygon['stroke.opacity'] =
          _.get(values, 'leaflet.style.polygon.stroke.opacity',
            _.get(this.options, 'style.polygon.stroke.opacity', _.get(DefaultStyle, 'polygon.stroke.opacity')))
      } else {
        await this.processTemplates(values, ['color', 'opacity', 'stroke.color', 'stroke.width', 'stroke.opacity'], 'polygon', this.defaultPolygon, this.polygonStyles)
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
      if (this.isVectorLayer) {
        // Points
        await this.fillIconStyles(values)
        // Lines
        await this.fillLineStyles(values)
        // Polygons
        await this.fillPolygonStyles(values)
      }
      if (this.hasFeatureSchema) {
        // Popup
        await this.fillPopupStyles(values)
        // Tooltip
        await this.fillTooltipStyles(values)
        // Infobox
        await this.fillInfoBoxStyles(values)
      }
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
        'leaflet.cluster': (this.clustering ? { disableClusteringAtZoom: this.disableClusteringAtZoom } : false),
        'cesium.cluster': (this.clustering ? { pixelRange: this.clusteringPixelRange } : false)
      }
    },
    iconStylesValues () {
      // Use dot notation as it will be used to update style values using a patch operation
      const templates = generateStyleTemplates(['color', 'size', 'shape', 'icon.classes', 'icon.color', 'icon.size'], 'point', this.defaultPoint, this.iconStyles)
      // Globe does only support simple styling and maki icon right now
      return Object.assign({}, _.mapKeys(templates, (value, key) => `leaflet.${key}`),
        _.mapKeys(_.pick(templates, ['style.point.shape', 'style.point.size', 'style.point.color']), (value, key) => `cesium.${key}`))
    },
    lineStylesValues () {
      // Use dot notation as it will be used to update style values using a patch operation
      const templates = generateStyleTemplates(['color', 'width', 'opacity'], 'line', this.defaultLine, this.lineStyles)
      return Object.assign({}, _.mapKeys(templates, (value, key) => `leaflet.${key}`), _.mapKeys(templates, (value, key) => `cesium.${key}`))
    },
    polygonStylesValues () {
      // Use dot notation as it will be used to update style values using a patch operation
      const templates = generateStyleTemplates(['color', 'opacity', 'stroke.color', 'stroke.width', 'stroke.opacity'], 'polygon', this.defaultPolygon, this.polygonStyles)
      return Object.assign({}, _.mapKeys(templates, (value, key) => `leaflet.${key}`), _.mapKeys(templates, (value, key) => `cesium.${key}`))
    },
    popupStylesValues () {
      return {
        'leaflet.popup': (this.popup ? { pick: this.popupProperties.map(property => property.value) } : false),
        'cesium.popup': (this.popup ? { pick: this.popupProperties.map(property => property.value) } : false)
      }
    },
    tooltipStylesValues () {
      return {
        'leaflet.tooltip': (this.tooltip ? { property: this.tooltipProperty.value } : false),
        'cesium.tooltip': (this.tooltip ? { property: this.tooltipProperty.value } : false)
      }
    },
    infoBoxStylesValues () {
      return {
        'leaflet.infobox': (this.infobox ? { pick: this.infoboxProperties.map(property => property.value) } : false),
        'cesium.infobox': (this.infobox ? { pick: this.infoboxProperties.map(property => property.value) } : false)
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
      if (this.isVectorLayer) {
        // Point style
        _.mergeWith(values, this.iconStylesValues(), customizer)
        // Line style
        _.mergeWith(values, this.lineStylesValues(), customizer)
        // Polygon style
        _.mergeWith(values, this.polygonStylesValues(), customizer)
      }
      if (this.hasFeatureSchema) {
        // Popup style
        _.merge(values, this.popupStylesValues())
        // Tooltip style
        _.merge(values, this.tooltipStylesValues())
        // Infobox style
        _.merge(values, this.infoBoxStylesValues())
      }
      return values
    },
    async onAddIconStyle (property) {
      // Default icon
      let color = _.get(this.options, 'style.point.color')
      if (color) color = kCoreUtils.getPaletteFromColor(color)
      const style = await this.createStyle(property.value, {
        'icon.classes': _.get(this.options, 'style.point.icon.classes', 'fas fa-circle'),
        'icon.color': _.get(this.options, 'style.point.icon.color', 'black'),
        'icon.size': _.get(this.options, 'style.point.icon.size', 12),
        color: color || 'red',
        size: _.get(this.options, 'style.point.size', 24),
        shape: _.get(this.options, 'style.point.shape', 'circle')
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
        name: style['icon.classes'],
        color: style['icon.color']
      })
    },
    onIconChanged (icon) {
      Object.assign(this.editedStyle, {
        'icon.color': icon.color,
        'icon.classes': icon.name
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
        color: _.get(this.options, 'style.line.color', 'red'),
        width: _.get(this.options, 'style.line.width', 1),
        opacity: _.get(this.options, 'style.line.opacity', 1)
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
        color: _.get(this.options, 'style.polygon.color', 'green'),
        opacity: _.get(this.options, 'style.polygon.opacity', 1),
        'stroke.color': _.get(this.options, 'style.polygon.stroke.color', 'red'),
        'stroke.width': _.get(this.options, 'style.polygon.stroke.width', 1),
        'stroke.opacity': _.get(this.options, 'style.polygon.stroke.opacity', 1)
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
