import _ from 'lodash'
import { colors, getCssVar, setCssVar } from 'quasar'

const themeColors = ['primary', 'secondary', 'accent', 'dark', 'info', 'positive', 'negative', 'warning']

export const Theme = {
  initialize () {
    if (this.default) return
    this.default = {}
    themeColors.forEach(color => { this.default[color] = getCssVar(color) })
  },
  apply (theme) {
    if (typeof theme === 'string') {
      // Compute the colors according the primary
      setCssVar('primary', theme)
      setCssVar('secondary', colors.lighten(theme, 75))
      setCssVar('accent', colors.lighten(theme, 25))
      setCssVar('dark', colors.lighten(theme, -25))
      setCssVar('info', colors.lighten(theme, 25))
      setCssVar('positive', this.default.positive)
      setCssVar('negative', this.default.negative)
      setCssVar('warning', this.default.warning)
    } else {
      themeColors.forEach(color => { setCssVar(color, _.get(theme, color, this.default[color])) })
    }
  },
  restore () {
    themeColors.forEach(color => { setCssVar(color, this.default[color]) })
  }
}

// Ensure it is initialized here as we can use it before initializing core module
// so that components will be created with the right theme upfront
Theme.initialize()
