const KANO_API_PREFIX = '/api'
const KANO_DOMAIN = 'http://localhost:8086'

// Map engine configuration
const mapEngine = {
  viewer: {
    minZoom: 3,
    maxZoom: 21,
    center: [47, 3],
    zoom: 6,
    maxBounds: [[-90, -180], [90, 180]],
    maxBoundsViscosity: 0.25,
    timeDimension: true,
    rotateControl: false,
    attributionControl: false
  },
  // COLORS USED IN STYLES SHOULD BE PART OF THE QUASAR PALETTE NOT RANDOM RGB COLORS
  // THIS IS DUE TO KDK EDITING COMPONENTS ONLY SUPPORTING COLORS FROM PALETTE NOW
  // Default GeoJSON layer style for polygons/lines
  style: {
    point: {
      shape: 'circle', color: 'red', opacity: 0.5, stroke: { color: 'red' }
    },
    line: {
      color: 'red', width: 3
    },
    polygon: {
      color: 'red', opacity: 0.5, stroke: { color: 'red' }
    },
    location: {
      point: {
        shape: 'marker-pin',
        color: 'primary',
        opacity: 1,
        size: [20, 30],
        stroke: { color: 'primary' },
        icon: { classes: 'fas fa-circle', color: 'white', size: 12, translation: ['-50%', '-90%'] }
      },
      line: { color: 'primary', width: 3 },
      polygon: {
        color: 'primary',
        opacity: 0.5,
        stroke: { color: 'primary' }
      }
    },
    edition: {
      point: {
        shape: 'circle', color: 'yellow', stroke: { color: 'red', width: 3, dashArray: '0 5 0' }
      },
      line: {
        color: 'red', width: 3, dashArray: '0 5 0'
      },
      polygon: {
        color: 'yellow', opacity: 0.5, stroke: { color: 'red', width: 3, dashArray: '0 5 0' }
      }
    },
    selection: {
      point: {
        shape: 'circle',
        color: 'primary',
        opacity: 0.25,
        radius: 12,
        stroke: { color: 'primary', opacity: 0.25, width: 3 }
      },
      line: {
        color: 'primary', opacity: 0.25, width: 10
      },
      polygon: {
        color: 'primary', opacity: 0.25, stroke: { color: 'primary', opacity: 0.25, width: 10 }
      }
    }
  },
  // Default GeoJSON infobox will display all properties
  popup: { pick: [] },
  infobox: {},
  cluster: { disableClusteringAtZoom: 18 },
  fileLayers: {
    fileSizeLimit: 1024 * 1024, // 1GB
    formats: ['.geojson', '.kml', '.gpx']
  }
}

// Globe engine configuration
const globeEngine = {
  viewer: {
    sceneMode: 3, // SceneMode.COLUMBUS_VIEW = 1, SceneMode.SCENE3D = 3,
    sceneModePicker: false,
    infoBox: false,
    scene3DOnly: true,
    homeButton: false,
    geocoder: false,
    navigationHelpButton: false,
    baseLayerPicker: false,
    vrButton: false,
    fullscreenButton: false,
    animation: false,
    timeline: false,
    //creditContainer: 'globe-credit',
    depthTestAgainstTerrain: true,
    cameraChangedEventPercentage: 0.2
  },
  fileLayers: {
    clearOnDrop: false,
    flyToOnDrop: true,
    clampToGround: true
  },
  // Default GeoJSON layer style for points/polygons/lines
  // SHOULD NOT COVER MORE THAN SIMPLE STYLE SPEC AND MAKI ICONS
  style: {
    point: {
      shape: 'marker', color: 'red'
    },
    line: {
      color: 'red', width: 3
    },
    polygon: {
      color: 'red', opacity: 0.5, stroke: { color: 'red' }
    },
    selection: {
      point: {
        shape: 'marker', color: 'primary', opacity: 0.25
      },
      line: {
        color: 'primary', opacity: 0.25, width: 10
      },
      polygon: {
        color: 'primary', opacity: 0.25, stroke: { color: 'primary', opacity: 0.25, width: 10 }
      }
    }
  },
  entityStyle: {
    billboard: {
      heightReference: 'Cesium.HeightReference.CLAMP_TO_GROUND'
    },
    label: {
      heightReference: 'Cesium.HeightReference.CLAMP_TO_GROUND',
      verticalOrigin: 'Cesium.VerticalOrigin.BASELINE'
    },
    polyline: {
      clampToGround: true
    }
  },
  tooltip: {
    options: {
      showBackground: true,
      backgroundColor: 'Cesium.Color.WHITE',
      font: '14px monospace',
      fillColor: 'Cesium.Color.BLACK',
      outlineColor: 'Cesium.Color.BLACK',
      horizontalOrigin: 'Cesium.HorizontalOrigin.LEFT',
      verticalOrigin: 'Cesium.VerticalOrigin.CENTER',
      pixelOffset: {
        type: 'Cesium.Cartesian2',
        options: [32, -32]
      }
    }
  },
  // Default GeoJSON infobox will display all properties
  popup: {
    pick: [],
    options: {
      showBackground: true,
      backgroundColor: 'Cesium.Color.WHITE',
      font: '14px monospace',
      fillColor: 'Cesium.Color.BLACK',
      outlineColor: 'Cesium.Color.BLACK',
      horizontalOrigin: 'Cesium.HorizontalOrigin.CENTER',
      verticalOrigin: 'Cesium.VerticalOrigin.BOTTOM',
      pixelOffset: {
        type: 'Cesium.Cartesian2',
        options: [0, -64]
      }
    }
  },
  infobox: {},
  clusterStyle: {
    label: {
      show: true,
      text: '<%= entities.length.toLocaleString() %>'
    }
  }
}

export default {
  domain: KANO_DOMAIN,
  apiPath: KANO_API_PREFIX,
  apiJwt: 'kano-jwt',
  apiTimeout: 30000,
  transport: 'websocket', // Could be 'http' or 'websocket',
  gatewayJwtField: 'jwt',
  gatewayJwt: 'kano-gateway-jwt',
  appName: 'Kano',
  locale: {
    // If you'd like to force locale otherwise it is retrieved from browser
    // default: 'en',
    fallback: 'en'
  },
  logs: {
    level: (((process.env.NODE_ENV === 'development') || process.env.DEBUG) ? 'debug' : 'info')
  },
  layout: {
    page: { visible: true },
    panes: {
      left: { opener: true },
      top: { opener: true, visible: true },
      right: { opener: true },
      bottom: { opener: true }
    },
    fab: { visible: true }
  },
  engines: {
    leaflet: mapEngine,
    cesium: globeEngine
  },
  mapActivity: {
    padding: false
  },
  globeActivity: {
    padding: false
  }
}
