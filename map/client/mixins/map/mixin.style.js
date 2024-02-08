import _ from 'lodash'
import { getDefaultPointStyle, getDefaultLineStyle, getDefaultPolygonStyle } from '../../utils.map.js'

export const style = {
  created () {
    this.registerStyle('point', getDefaultPointStyle)
    this.registerStyle('line', getDefaultLineStyle)
    this.registerStyle('polygon', getDefaultPolygonStyle)
  }
}
