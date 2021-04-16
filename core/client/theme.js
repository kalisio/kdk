import _ from 'lodash'
import { colors } from 'quasar'

export const Theme = {
  initialize () {
    this.brandPrimary = colors.getBrand('primary')
  },
  apply (color) {
    if (_.isEmpty(color)) this.restore()
    else {
      colors.setBrand('primary', color)
      colors.setBrand('secondary', colors.lighten(color, 25))
      colors.setBrand('accent', colors.lighten(color, 75))
    }
  },
  restore () {
    this.apply(this.brandPrimary)
  }
}
