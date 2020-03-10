import _ from 'lodash'

const baseItemMixin = {
  props: {
    contextId: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data () {
    return {
      actions: {
        pane: [],
        menu: []
      }
    }
  },
  methods: {
    registerPaneAction (action) {
      this.registerAction('pane', action)
    },
    registerMenuAction (action) {
      this.registerAction('menu', action)
    },
    registerAction (type, action) {
      this.actions[type] = this.actions[type].concat([action])
    },
    getActions (type) {
      return this.actions[type] || []
    },
    getAction (name) {
      let action = null
      _.forOwn(this.actions, (value, key) => {
        const actionForType = value.find(action => action.name === name)
        if (actionForType) action = actionForType
      })
      return action
    },
    clearActions () {
      this.actions.menu = []
      this.actions.pane = []
    },
    // This method should be overriden in items
    refreshActions () {
      this.clearActions()
    },
    onItemSelected () {
      this.$emit('item-selected', this.item)
    }
  },
  created () {
    // Register the actions
    this.refreshActions()
    // Whenever the user abilities are updated, update actions as well
    this.$events.$on('user-abilities-changed', this.refreshActions)
  },
  beforeDestroy () {
    this.$events.$off('user-abilities-changed', this.refreshActions)
  }
}

export default baseItemMixin
