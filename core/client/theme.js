import _ from 'lodash'
import { colors } from 'quasar'

const brandColors = ['primary', 'secondary', 'accent', 'dark', 'info', 'positive', 'negative', 'warning']

export const Theme = {
  initialize () {
    if (this.default) return
    this.default = {}
    brandColors.forEach(color => { this.default[color] = colors.getBrand(color) })
  },
  apply (theme) {
    if (typeof theme === 'string') {
      // Compute the colors according the primary
      colors.setBrand('primary', theme)
      colors.setBrand('secondary', colors.lighten(theme, 75))
      colors.setBrand('accent', colors.lighten(theme, 25))
      colors.setBrand('dark', colors.lighten(theme, -25))
      colors.setBrand('info', colors.lighten(theme, 25))
      colors.setBrand('positive', this.default.positive)
      colors.setBrand('negative', this.default.negative)
      colors.setBrand('warning', this.default.warning)
    } else {
      brandColors.forEach(color => { colors.setBrand(color, _.get(theme, color, this.default[color])) })
    }
  },
  restore () {
    brandColors.forEach(color => { colors.setBrand(color, this.default[color]) })
  }
}

// Ensure it is initialized here as we can use it before initializing core module
// so that components will be created with the right theme upfront
Theme.initialize()
