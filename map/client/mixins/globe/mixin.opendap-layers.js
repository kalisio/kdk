import _ from 'lodash'
// import logger from 'loglevel'
import cesium from 'cesium/Source/Cesium.js'

export default {
  methods: {
    createCesiumOpendapLayer (options) {
      const cesiumOptions = options.cesium
      // Check for valid type
      if (cesiumOptions.type !== 'opendap') return

      const urlPromise = new Promise(async (resolve, reject) => {
        try {
          const accessToken = await this.$api.passport.getJWT()
          const url = new Cesium.Resource({
            url: 'http://localhost:8081/api/daptiles/tileset.json',
            headers: {
              Authorization: `Bearer ${accessToken}`
            },
            queryParameters: {
              file: 'mf-arpege-01/2019/06/15/11360000000.20190615180000.grib',
              query: 'Temperature_height_above_ground',
              dimensions: JSON.stringify({ time2: 0, height_above_ground1: 0 }),
              latitude: 'lat',
              longitude: 'lon'
            }
          })
          resolve(url)
        } catch (e) {
          reject(e)
        }
      })

      var tileset = new Cesium.Cesium3DTileset({
        url: urlPromise
        // url: 'http://127.0.0.1:3000/tileset.json?file=mf-arpege-05/2019/06/16/18/T6086_G_T_Sol_20190616180000.grib&variable=Temperature_surface&time=0',
        // shadows: Cesium.ShadowMode.DISABLED,
        // classificationType: Cesium.ClassificationType.CESIUM_3D_TILE,
        // url: Cesium.IonResource.f ffromAssetId(5741)
        // debugShowBoundingVolume: true,
        // debugShowUrl: true
      })

      /*
        tileset.style = new Cesium.Cesium3DTileStyle({
        color: 'mix(vec4(0,0,1,0.6), vec4(1,0,0,0.6), ${temperature})'
        })
      */

      return tileset
    }
  },
  created () {
    this.registerCesiumConstructor(this.createCesiumOpendapLayer)
  }
}
