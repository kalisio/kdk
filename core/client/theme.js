import { colors } from 'quasar'

export const Theme = {
  initialize () {
    this.brandPrimary = colors.getBrand('primary')
  },
  apply (primary) {
    colors.setBrand('primary', primary)
    colors.setBrand('secondary', colors.lighten(primary, 25))
    colors.setBrand('accent', colors.lighten(primary, 75))
  },
  restore () {
    this.apply(this.brandPrimary)
  }
}
