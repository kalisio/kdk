import { colors } from 'quasar'

export const Theme = {
  initialize () {
    this.primary = colors.getBrand('primary')
    this.secondary = colors.getBrand('secondary')
    this.accent = colors.getBrand('accent')
    this.dark = colors.getBrand('dark')
  },
  apply (primary, secondary, accent, dark) {
    colors.setBrand('primary', primary)
    colors.setBrand('secondary', secondary || colors.lighten(primary, 80))
    colors.setBrand('accent', accent || colors.lighten(primary, 20))
    colors.setBrand('dark', dark || colors.lighten(primary, -20))
  },
  restore () {
    colors.setBrand('primary', this.primary)
    colors.setBrand('secondary', this.secondary)
    colors.setBrand('accent', this.accent)
    colors.setBrand('dark', this.dark)
  }
}
