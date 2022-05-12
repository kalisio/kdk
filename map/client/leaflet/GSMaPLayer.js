import _ from 'lodash'
import L from 'leaflet'
import moment from 'moment'
import { buildColorMap } from '../utils.js'

const GSMaPLayer = L.TileLayer.extend({
  initialize (options) {
    // default product when none is specified: rain
    this.product = options.product || 'rain'

    const url = this.makeUrl(options.time)

    const updatedOptions = Object.assign({ tms: true }, options)
    L.TileLayer.prototype.initialize.call(this, url, updatedOptions)

    // colormap legend support
    this.colorMap = buildColorMap(_.get(options, 'chromajs'))
    if (this.colorMap) {
      this.on('tileload', (event) => {
        if (!this.hasData) {
          this.fire('data')
          this.hasData = true
        }
      })
    }
  },

  makeUrl (time) {
    const t = time || moment()

    // data interval is every half hour for GSMaP_NOW
    const halfHour = moment.duration(30, 'minutes')
    const stepTime = moment(Math.trunc(t / halfHour) * halfHour).utc()

    const baseUrl = 'https://sharaku.eorc.jaxa.jp/cgi-bin/trmm/GSMaP_NOW/tilemap/tile_'
    const timeQuery = `year=${stepTime.year()}&month=${stepTime.month() + 1}&day=${stepTime.date()}&hour=${stepTime.hour()}&min=${stepTime.minute()}&z={z}&x={x}&y={y}`

    if (this.product === 'rain12' || this.product === 'rain24' || this.product === 'rain72') {
      return baseUrl + `total.py?prod=${this.product}&` + timeQuery
    }
    if (this.product === 'ir') {
      return baseUrl + `ir.py?prod=${this.product}&` + timeQuery
    }

    // default product is rain
    return baseUrl + 'rain.py?prod=rain&' + timeQuery
  },

  setCurrentTime (time) {
    const url = this.makeUrl(time)
    this.setUrl(url, false)
  }
})

export { GSMaPLayer }
