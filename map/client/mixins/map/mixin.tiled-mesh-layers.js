import _ from 'lodash'
import L from 'leaflet'
import chroma from 'chroma-js'
import * as PIXI from 'pixi.js'
import 'leaflet-pixi-overlay'
import AbortController from 'abort-controller'

import { makeGridSource, extractGridSourceConfig } from '../../../common/grid'
import { RawValueHook, buildPixiMeshFromGrid, buildColorMapShaderCodeFromClasses, buildColorMapShaderCodeFromDomain, buildShaderCode, WEBGL_FUNCTIONS } from '../../pixi-utils'

// TODO
// figure out initialZoom stuff

const TiledMeshLayer = L.GridLayer.extend({
  async initialize (options) {
    this.conf = {}
    // keep color scale options
    this.conf.chromajs = options.chromajs
    // keep rendering options
    this.conf.render = {
      cutOver: options.cutOver,
      cutUnder: options.cutUnder,
      pixelColorMapping: options.pixelColorMapping
    }
    // keep debug options
    this.conf.debug = {
      showTileInfos: options.showTileInfos,
      meshAsPoints: options.meshAsPoints,
      showShader: options.showShader
    }

    this.resolutionScale = _.get(options, 'resolutionScale', [1.0, 1.0])

    // setup pixi objects
    this.pixiRoot = new PIXI.Container()
    this.pixiLayer = L.pixiOverlay(
      utils => this.renderPixiLayer(utils),
      this.pixiRoot,
      { destroyInteractionManager: true, shouldRedrawOnMove: function () { return true } })
    this.layerUniforms = new PIXI.UniformGroup({ in_layerAlpha: options.opacity, in_zoomLevel: 1.0 })
    this.pixiState = new PIXI.State()
    this.pixiState.culling = true
    this.pixiState.blendMode = PIXI.BLEND_MODES.SCREEN

    // setup layer global uniforms (as opposed to tile specific uniforms)
    this.cutValueUniform = null
    if (options.cutOver) {
      this.layerUniforms.uniforms.cutOver = 0.0
      if (options.cutOver === 'levels') {
        this.cutValueUniform = 'in_cutOver'
      } else {
        this.layerUniforms.uniforms.in_cutOver = options.cutOver
      }
    }
    if (options.cutUnder) {
      this.layerUniforms.uniforms.cutUnder = 0.0
      if (options.cutUnder === 'levels') {
        this.cutValueUniform = 'in_cutUnder'
      } else {
        this.layerUniforms.uniforms.in_cutUnder = options.cutUnder
      }
    }

    // register event callbacks
    this.on('tileload', (event) => { this.onTileLoad(event) })
    this.on('tileunload', (event) => { this.onTileUnload(event) })

    // instanciate grid source
    const [gridKey, gridConf] = extractGridSourceConfig(options)
    // instanciate grid source
    this.gridSource = makeGridSource(gridKey, { weacastApi: options.weacastApi })
    // keep ref on callback to be able to remove it
    this.onDataChangedCallback = this.onDataChanged.bind(this)
    this.gridSource.on('data-changed', this.onDataChangedCallback)
    this.gridSource.setup(gridConf)
  },

  onAdd (map) {
    this.map = map
    map.addLayer(this.pixiLayer)

    // be notified when zoom starts
    // keep a ref on bound objects to be able to remove them later
    this.zoomStartCallback = this.onZoomStart.bind(this)
    this.zoomEndCallback = this.onZoomEnd.bind(this)
    map.on('zoomstart', this.zoomStartCallback)
    map.on('zoomend', this.zoomEndCallback)

    L.GridLayer.prototype.onAdd.call(this, map)
  },

  onRemove (map) {
    // remove map listeners
    map.off('zoomstart', this.zoomStartCallback)
    map.off('zoomend', this.zoomEndCallback)
    this.zoomStartCallback = null
    this.zoomEndCallback = null

    map.removeLayer(this.pixiLayer)
    this.map = null

    L.GridLayer.prototype.onRemove.call(this, map)
  },

  createTile (coords, done) {
    const tileSize = this.getTileSize()
    const pixelCoords0 = L.point(coords.x * tileSize.x, coords.y * tileSize.y)
    const pixelCoords1 = L.point(pixelCoords0.x + tileSize.x, pixelCoords0.y + tileSize.y)
    const latLonCoords0 = this.map.wrapLatLng(this.map.unproject(pixelCoords0, coords.z))
    const latLonCoords1 = this.map.wrapLatLng(this.map.unproject(pixelCoords1, coords.z))

    const tile = document.createElement('div')

    const reqBBox = [
      Math.min(latLonCoords0.lat, latLonCoords1.lat), Math.min(latLonCoords0.lng, latLonCoords1.lng),
      Math.max(latLonCoords0.lat, latLonCoords1.lat), Math.max(latLonCoords0.lng, latLonCoords1.lng)
    ]
    const resolution = [
      this.resolutionScale[0] * ((reqBBox[2] - reqBBox[0]) / (tileSize.y - 1)),
      this.resolutionScale[1] * ((reqBBox[3] - reqBBox[1]) / (tileSize.x - 1))
    ]
    tile.fetchController = new AbortController()
    this.gridSource.fetch(tile.fetchController.signal, reqBBox, resolution)
      .then(grid => {
        // fetch ended, can't abort anymore
        tile.fetchController = null
        if (grid && grid.hasData()) {
          // build mesh
          const raw = new RawValueHook('in_layerValue')
          const geometry = buildPixiMeshFromGrid(grid, [raw])

          // compute tile specific uniforms
          const dataBBox = grid.getBBox()
          const offsetScale = [
            dataBBox[0], dataBBox[1],
            dataBBox[2] - dataBBox[0], dataBBox[3] - dataBBox[1]
          ]
          const uniforms = {
            in_layerBounds: Float32Array.from(reqBBox),
            in_layerOffsetScale: Float32Array.from(offsetScale),
            layerUniforms: this.layerUniforms
          }
          if (grid.nodata !== undefined) {
            uniforms.in_nodata = grid.nodata
          }

          const shader = new PIXI.Shader(this.program, uniforms)
          const mode = this.conf.debug.meshAsPoints ? PIXI.DRAW_MODES.POINTS : PIXI.DRAW_MODES.TRIANGLE_STRIP
          tile.mesh = new PIXI.Mesh(geometry, shader, this.pixiState, mode)
        }

        if (grid && this.conf.debug.showTileInfos) {
          const dims = grid.getDimensions()
          const res = grid.getResolution()
          tile.innerHTML =
            `req res: ${resolution[0].toPrecision(4)} ${resolution[1].toPrecision(4)}</br>
             got res: ${res[0].toPrecision(4)} ${res[1].toPrecision(4)}</br>
             ${dims[0]} x ${dims[1]} vertex for ${tileSize.y} x ${tileSize.x} pixels`
          tile.style.outline = '1px solid red'
        }

        done(null, tile)
      })
      .catch(err => {
        done(err, tile)
        throw err
      })

    return tile
  },

  onTileLoad (event) {
    // tile loaded
    const mesh = event.tile.mesh
    if (!mesh) return

    mesh.zoomLevel = event.coords.z
    mesh.visible = (mesh.zoomLevel === this.map.getZoom())
    this.pixiRoot.addChild(mesh)
    if (mesh.visible) {
      this.pixiLayer.redraw()
    }
  },

  onTileUnload (event) {
    // tile unloaded
    if (event.tile.fetchController) {
      // fetch controller still present, abort fetching underlying data
      event.tile.fetchController.abort()
      event.tile.fetchController = null
    }
    if (event.tile.mesh) {
      // remove and destroy tile mesh
      this.pixiRoot.removeChild(event.tile.mesh)
      if (event.tile.mesh.visible) {
        this.pixiLayer.redraw()
      }
      event.tile.mesh.destroy()
      event.tile.mesh = null
    }
  },

  onZoomStart (event) {
    // hide meshes from current zoom level
    // this prevents visual weirdness when zooming where
    // zoom level 'n' tiles are still visible
    // and zoom level 'n+1' are being loaded on top of them
    // when alpha blending is used, this is annoying
    const zoomLevel = this.map.getZoom()
    for (const mesh of this.pixiRoot.children) {
      if (mesh.zoomLevel === zoomLevel) mesh.visible = false
    }
  },

  onZoomEnd (event) {
    // show meshes at current zoom level
    // this restores visibility for meshes that may have been hidden
    // on zoomstart event
    // this is important when quickly zoomin in and out
    // because some meshes may not have been evicted yet
    const zoomLevel = this.map.getZoom()
    for (const mesh of this.pixiRoot.children) {
      if (mesh.zoomLevel === zoomLevel) mesh.visible = true
    }
    this.pixiLayer.redraw()
  },

  onDataChanged () {
    const bbox = this.gridSource.getBBox()
    if (bbox) {
      // allow grid layer to only request tiles located in those bounds
      const c1 = L.latLng(bbox[0], bbox[1])
      const c2 = L.latLng(bbox[2], bbox[3])
      this.options.bounds = L.latLngBounds(c1, c2)
    }

    // eventually, update color map
    this.updateColorMap()
    // eventually, update shader
    this.updateShader()

    // clear tiles and request again
    this.redraw()
    this.fire('data', this.gridSource)
  },

  updateColorMap () {
    // create color map using domain or classes
    // domain and classes can be specified from options
    // if not, domain can be gathered from grid source
    this.colorMap = null
    this.colorMapShaderCode = null

    let domain = null
    const classes = _.get(this.conf, 'chromajs.classes', null)
    if (!classes) {
      domain = _.get(this.conf, 'chromajs.domain', null)
      if (!domain) {
        domain = this.gridSource.getDataBounds()
      }
    }

    const invert = _.get(this.conf, 'chromajs.invertScale', false)
    const colors = _.get(this.conf, 'chromajs.scale', null)
    const scale = chroma.scale(colors)
    // translate to glsl style colors for shader code
    const glcolors = scale.colors().map(c => chroma(c).gl())

    if (domain) {
      this.colorMap = chroma.scale(colors).domain(invert ? domain.slice().reverse() : domain)
      this.colorMapShaderCode = buildColorMapShaderCodeFromDomain(domain, glcolors, invert)
    } else if (classes) {
      this.colorMap = chroma.scale(colors).classes(invert ? classes.slice().reverse() : classes)
      this.colorMapShaderCode = buildColorMapShaderCodeFromClasses(classes, glcolors, invert)
    } else {
      console.error("Couldn't find any domain or classes to build color map!")
    }
  },

  updateShader () {
    const features = [
      // feature projecting layer position
      {
        name: 'layerPosition',
        varyings: ['vec2 frg_layerPosition'],
        vertex: {
          attributes: ['vec2 in_layerPosition'],
          uniforms: ['mat3 translationMatrix', 'mat3 projectionMatrix', 'float in_zoomLevel', 'vec4 in_layerOffsetScale'],
          functions: [WEBGL_FUNCTIONS.latLonToWebMercator, WEBGL_FUNCTIONS.unpack2],
          code: `  frg_layerPosition = unpack2(in_layerPosition, in_layerOffsetScale);
  vec2 projected = latLonToWebMercator(vec3(frg_layerPosition, in_zoomLevel));
  gl_Position = vec4((projectionMatrix * translationMatrix * vec3(projected, 1.0)).xy, 0.0, 1.0);`
        },
        fragment: {
          uniforms: ['vec4 in_layerBounds'],
          code: `  bvec4 outside = bvec4(lessThan(frg_layerPosition, in_layerBounds.xy), greaterThan(frg_layerPosition, in_layerBounds.zw));
  if (any(outside)) discard;`
        }
      },
      // feature defining layer's scalar value
      {
        name: 'layerValue',
        varyings: ['float frg_layerValue'],
        vertex: {
          attributes: ['float in_layerValue'],
          code: '  frg_layerValue = in_layerValue;'
        }
      }
    ]

    // feature discarding fragments when scalar value is > threshold
    if (this.conf.render.cutOver) {
      features.push({
        name: 'cutOver',
        fragment: {
          uniforms: ['float in_cutOver'],
          code: '  if (frg_layerValue > in_cutOver) discard;'
        }
      })
    }
    // feature discarding fragments when scalar value is < threshold
    if (this.conf.render.cutUnder) {
      features.push({
        name: 'cutUnder',
        fragment: {
          uniforms: ['float in_cutUnder'],
          code: '  if (frg_layerValue < in_cutUnder) discard;'
        }
      })
    }
    // feature discarding fragments when scalar value is nodata
    if (this.gridSource.supportsNoData()) {
      features.push({
        name: 'nodata',
        varyings: ['float frg_validValue'],
        vertex: {
          uniforms: ['float in_nodata'],
          code: '  frg_validValue = (in_layerValue == in_nodata ? 0.0 : 1.0);'
        },
        fragment: {
          code: '  if (frg_validValue != 1.0) discard;'
        }
      })
    }
    // feature performing color mapping ...
    if (this.colorMapShaderCode) {
      if (this.conf.render.pixelColorMapping) {
        // ... per fragment
        features.push({
          name: 'colormap',
          fragment: {
            functions: [this.colorMapShaderCode],
            code: '  vec4 color = ColorMap(frg_layerValue);'
          }
        })
      } else {
        // ... or per vertex
        features.push({
          name: 'colormap',
          varyings: ['vec4 frg_color'],
          vertex: {
            functions: [this.colorMapShaderCode],
            code: '  frg_color = ColorMap(frg_layerValue);'
          },
          fragment: {
            code: '  vec4 color = frg_color;'
          }
        })
      }
    }
    // feature computing final fragment color
    features.push({
      name: 'tail',
      fragment: {
        uniforms: ['float in_layerAlpha'],
        code: `  gl_FragColor.rgb = color.rgb * in_layerAlpha;
  gl_FragColor.a = in_layerAlpha;`
      }
    })

    const [vtxCode, frgCode] = buildShaderCode(features)
    this.program = new PIXI.Program(vtxCode, frgCode)

    if (this.conf.debug.showShader) {
      console.log('Generated vertex shader:')
      console.log(vtxCode)
      console.log('Generated fragment shader:')
      console.log(frgCode)
    }
  },

  renderPixiLayer (utils) {
    this.layerUniforms.uniforms.in_zoomLevel = this.pixiLayer._initialZoom
    const renderer = utils.getRenderer()
    renderer.render(this.pixiRoot)
  },

  setCutValue (value) {
    if (this.cutValueUniform) {
      this.layerUniforms.uniforms[this.cutValueUniform] = value
      this.pixiLayer.redraw()
    }
  },

  setTime (time) {
    if (typeof this.gridSource.setTime === 'function') {
      this.gridSource.setTime(time)
    }
  },

  setModel (model) {
    if (typeof this.gridSource.setModel === 'function') {
      this.gridSource.setModel(model)
    }
  }

})

export default {
  methods: {
    createLeafletTiledMeshLayer (options) {
      const leafletOptions = options.leaflet || options

      // Check for valid type
      if (leafletOptions.type !== 'tiledMeshLayer') return

      // Copy options
      const colorMap = _.get(options, 'variables[0].chromajs', null)
      if (colorMap) Object.assign(leafletOptions, { chromajs: colorMap })
      const [gridKey, gridConf] = extractGridSourceConfig(options)
      leafletOptions[gridKey] = gridConf

      leafletOptions.weacastApi = this.weacastApi

      return new TiledMeshLayer(leafletOptions)
    },

    onShowTiledMeshLayer (layer, engineLayer) {
      const isTiledMeshLayer = engineLayer instanceof TiledMeshLayer
      if (!isTiledMeshLayer) return

      // store displayed layers
      this.tiledMeshLayers.set(layer._id, engineLayer)
      const levels = _.get(layer, 'levels')
      if (levels) { this.setSelectableLevels(layer, levels) }

      // setup layer
      engineLayer.setModel(this.forecastModel)
      engineLayer.setTime(this.currentTime)
    },

    onHideTiledMeshLayer (layer) {
      this.tiledMeshLayers.delete(layer._id)
      // layer being hidden, hide slider if any was required
      this.clearSelectableLevels(layer)
    },

    onSelectedLevelChangedTiledMeshLayer (value) {
      if (!this.selectableLevelsLayer) return

      // send selected value only to associated layer
      const layer = this.tiledMeshLayers[this.selectableLevelsLayer._id]
      if (!layer) return

      layer.setCutValue(value)
    },

    onForecastModelChangedTiledMeshLayer (model) {
      // broadcast to visible layers
      this.tiledMeshLayers.forEach(function (value, key, map) {
        value.setModel(model)
      })
    },

    onCurrentTimeChangedTiledMeshLayer (time) {
      // broadcast to visible layers
      this.tiledMeshLayers.forEach(function (value, key, map) {
        value.setTime(time)
      })
    }
  },

  created () {
    this.tiledMeshLayers = new Map()
    this.registerLeafletConstructor(this.createLeafletTiledMeshLayer)

    this.$on('layer-shown', this.onShowTiledMeshLayer)
    this.$on('layer-hidden', this.onHideTiledMeshLayer)
    this.$on('selected-level-changed', this.onSelectedLevelChangedTiledMeshLayer)
    this.$on('forecast-model-changed', this.onForecastModelChangedTiledMeshLayer)
    this.$on('current-time-changed', this.onCurrentTimeChangedTiledMeshLayer)
  },

  beforeDestroy () {
    this.$off('layer-shown', this.onShowTiledMeshLayer)
    this.$off('layer-hidden', this.onHideTiledMeshLayer)
    this.$off('selected-level-changed', this.onSelectedLevelChangedTiledMeshLayer)
    this.$off('forecast-model-changed', this.onForecastModelChangedTiledMeshLayer)
    this.$off('current-time-changed', this.onCurrentTimeChangedTiledMeshLayer)
  }
}
