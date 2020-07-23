import L from 'leaflet'
import * as PIXI from 'pixi.js'
import 'leaflet-pixi-overlay'
import AbortController from 'abort-controller'
import { featureEach, geomEach, coordEach } from '@turf/meta'
import tesselate from '@turf/tesselate'
import { buildShaderCode, WEBGL_FUNCTIONS } from '../pixi-utils'

const OsmBuildingLayer = L.GridLayer.extend({
  initialize (options) {
    L.GridLayer.prototype.initialize.call(this, options)

    this.conf = {}
    // keep rendering options
    this.conf.render = {}
    // keep debug options
    this.conf.debug = {
      showTileInfos: options.showTileInfos,
      meshAsPoints: options.meshAsPoints,
      showShader: options.showShader || true
    }

    this.pixiRoot = new PIXI.Container()
    this.pixiLayer = L.pixiOverlay(
      utils => this.renderPixiLayer(utils),
      this.pixiRoot,
      { destroyInteractionManager: true, shouldRedrawOnMove: function () { return true } })
    this.layerUniforms = { in_layerAlpha: options.opacity || 1.0, in_zoomLevel: 1.0 }
    this.pixiState = new PIXI.State()
    this.pixiState.culling = true
    // this.pixiState.blendMode = PIXI.BLEND_MODES.SCREEN

    const features = [
      {
        name: 'geometryCoords',
        vertex: {
          attributes: ['vec2 in_position'],
          uniforms: ['mat3 translationMatrix', 'mat3 projectionMatrix', 'float in_zoomLevel'],
          functions: [WEBGL_FUNCTIONS.latLonToWebMercator],
          code: `  vec2 projected = latLonToWebMercator(vec3(in_position, in_zoomLevel));
  gl_Position = vec4((projectionMatrix * translationMatrix * vec3(projected, 1.0)).xy, 0.0, 1.0);`
        }
      },
      {
        name: 'fragColor',
        fragment: {
          uniforms: ['float in_layerAlpha'],
          code: `  gl_FragColor.rgba = vec4(1.0, 0.0, 0.0, in_layerAlpha);`
        }
      }
    ]

    const [vtxCode, frgCode] = buildShaderCode(features)
    this.program = new PIXI.Program(vtxCode, frgCode)
    this.shader = new PIXI.Shader(this.program, this.layerUniforms)

    if (this.conf.debug.showShader) {
      console.log('Generated vertex shader:')
      console.log(vtxCode)
      console.log('Generated fragment shader:')
      console.log(frgCode)
    }

    // register event callbacks
    // this.on('tileload', (event) => { this.onTileLoad(event) })
    this.on('tileunload', (event) => { this.onTileUnload(event) })
  },

  onAdd (map) {
    map.addLayer(this.pixiLayer)

    // this.layerUniforms.uniforms.in_zoomLevel = this.pixiLayer._initialZoom
    this.layerUniforms.in_zoomLevel = this.pixiLayer._initialZoom

    L.GridLayer.prototype.onAdd.call(this, map)
  },

  onRemove (map) {
    map.removeLayer(this.pixiLayer)

    L.GridLayer.prototype.onRemove.call(this, map)
  },

  createTile (coords) {
    // https://{s}.data.osmbuildings.org/0.2/anonymous/tile/{z}/{x}/{y}.json

    const tile = document.createElement('div')

    const subdomains = ['a', 'b', 'c', 'd']
    const balance = Math.floor(Math.random() * subdomains.length)

    const url = `http://${subdomains[balance]}.data.osmbuildings.org/0.2/anonymous/tile/${coords.z}/${coords.x}/${coords.y}.json`
    fetch(url)
      .then(response => {
        if (!response.ok) {
          // if (response.status === 416) // no data for that tile
          throw new Error(response.statusText)
        }
        return response
      })
      .then(response => response.json())
      .then(geojson => {
        /*
        let numGeom = 0
        let numVertex = 0
        geomEach(geojson, (geometry, featureIndex, featureProps, featureBbox, featureId) => {
          coordEach(geometry, (coord, index, featureIndex, multiFeatureIndex) => {
            ++numVertex
          })
          ++numGeom
        })

        let vidx = 0
        let iidx = 0
        const restart = 4294967295
        const index = new Uint32Array(numVertex + (numGeom - 1))
        const position = new Float32Array(numVertex * 2)

        geomEach(geojson, (geometry, featureIndex, featureProps, featureBbox, featureId) => {
          if (featureProps.roofShape || featureProps.roofHeight) {
            console.log(featureProps)
          }
          coordEach(geometry, (coord, coordIndex, featureIndex, multiFeatureIndex) => {
            position[vidx * 2] = coord[1]
            position[vidx * 2 + 1] = coord[0]
            index[iidx++] = vidx
            ++vidx
          })

          index[iidx++] = restart
        })
        */
        
        geomEach(geojson, (geometry, featureIndex, featureProps, featureBbox, featureId) => {
          if (featureProps.minHeight || featureProps.minLevel) {
            console.log(featureProps)
          }
        })

        const tris = []
        featureEach(geojson, (feature, featureIndex) => {
          if (feature.geometry.type === 'Polygon') {
            const startsAt = feature.properties.minHeight || feature.properties.minLevel || 0
            if (startsAt === 0)
              tris.push(tesselate(feature))
          }
        })

        let numVertex = 0
        tris.forEach(tri => {
          geomEach(tri, (geometry, featureIndex, featureProps, featureBbox, featureId) => {
            coordEach(geometry, (coord, coordIndex, featureIndex, multiFeatureIndex) => {
              if (coordIndex < 3) {
                ++numVertex
              }
            })
          })
        })

        let vidx = 0
        const position = new Float32Array(numVertex * 2)
        tris.forEach(tri => {
          geomEach(tri, (geometry, featureIndex, featureProps, featureBbox, featureId) => {
            coordEach(geometry, (coord, coordIndex, featureIndex, multiFeatureIndex) => {
              if (coordIndex < 3) {
                position[vidx * 2] = coord[1]
                position[vidx * 2 + 1] = coord[0]
                ++vidx
              }
            })
          })
        })

        const geometry = new PIXI.Geometry()
                                 .addAttribute('in_position', position, 2, false, PIXI.TYPES.FLOAT)
                                 // .addIndex(index)

        // const shader = new PIXI.Shader(this.program, this.uniforms)
        // const mesh = new PIXI.Mesh(geometry, this.shader, this.pixiState, PIXI.DRAW_MODES.LINE_STRIP)
        // const mesh = new PIXI.Mesh(geometry, this.shader, this.pixiState, PIXI.DRAW_MODES.TRIANGLE_FAN)
        const mesh = new PIXI.Mesh(geometry, this.shader, this.pixiState, PIXI.DRAW_MODES.TRIANGLES)
        tile.mesh = mesh
        tile.mesh.visible = true
        this.pixiRoot.addChild(mesh)
        this.pixiLayer.redraw()
      })
      .catch(error => console.log(error))

    return tile
  },

  onTileUnload (event) {
    if (event.tile.mesh) {
      this.pixiRoot.removeChild(event.tile.mesh)
      if (event.tile.mesh.visible) {
        this.pixiLayer.redraw()
      }
      event.tile.mesh.destroy()
      event.tile.mesh = null
    }
  },

  renderPixiLayer (utils) {
    const renderer = utils.getRenderer()
    renderer.render(this.pixiRoot)
  }
})

export { OsmBuildingLayer }
