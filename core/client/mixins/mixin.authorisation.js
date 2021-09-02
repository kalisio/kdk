import logger from 'loglevel'
import { Store } from '../store'
import { defineAbilities } from '../../common/permissions'

const authorisationMixin = {
  methods: {
    async updateAbilities () {
      const user = Store.get('user')
      let abilities
      if (user) {
        abilities = await defineAbilities(user, this.$api)
        Store.set('user.abilities', abilities)
      }
      if (abilities) {
        logger.debug('New user abilities: ', abilities.rules)
      }
      return abilities
    }
  },
  async created () {
    // Check if abilities are already computed
    const abilities = Store.get('user.abilities')
    if (!abilities) {
      // Otherwise try to compute them
      await this.updateAbilities()
    }
    // Whenever the user is updated, update abilities as well
    this.$events.$on('user-changed', this.updateAbilities)
  },
  beforeDestroy () {
    this.$events.$off('user-changed', this.updateAbilities)
  }
}

export default authorisationMixin
