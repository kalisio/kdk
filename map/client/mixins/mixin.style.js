import _ from 'lodash'

export const style = {
  methods: {
    registerStyle (type, generator) {
      // Initialize on first registration
      if (!this[type + 'Factory']) this[type + 'Factory'] = []
      this[type + 'Factory'].push(generator)
    },
    unregisterStyle (type, generator) {
      _.pull(this[type + 'Factory'], generator)
    },
    generateStyle () {
      const args = Array.from(arguments)
      const type = args[0]
      if (!this[type + 'Factory']) return
      args.shift()
      let style
      // Iterate over all registered generators until we find one
      // Last registered overrides previous ones (usefull to override default styles)
      for (let i = this[type + 'Factory'].length - 1; i >= 0; i--) {
        const generator = this[type + 'Factory'][i]
        style = generator(...args)
        if (style) break
      }
      return style
    }
  }
}
