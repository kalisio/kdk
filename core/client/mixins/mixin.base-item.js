import _ from 'lodash'
import { getIconName, getInitials } from '../utils'

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
      actions: null
    }
  },
  computed: {
    avatar () {
      const iconName = this.getIconName()
      const iconColor = this.getIconColor()
      if (iconName || iconColor) {
        return {
          type: 'icon',
          icon: { name: iconName, color: iconColor }
        }
      }
      const name = this.getName()
      return {
        type: 'text',
        text: getInitials(name)
      }
    },
    name () {
      return this.getName()
    },
    description () {
      return this.getDescription()
    }
  },
  methods: {
    getIcon () {
      return (this.options.iconField ? _.get(this.item, this.options.iconField, '') : this.item.icon)
    },
    getIconName () {
      // Check for custom icon name field
      if (this.options.iconNameField) {
        return getIconName(this.item, this.options.iconNameField)
      } else {
        const icon = this.getIcon()
        return (icon ? getIconName(icon, 'name') : '')
      }
    },
    getIconColor () {
      // Check for custom icon color field
      if (this.options.iconColorField) {
        return _.get(this.item, this.options.iconColorField, '')
      } else {
        const icon = this.getIcon()
        return (icon ? _.get(icon, 'color', '') : '')
      }
    },
    getName () {
      // Check for custom name field
      return this.options.nameField ? _.get(this.item, this.options.nameField, '') : this.item.name
    },
    getDescription () {
      // Check for custom description field
      return this.options.descriptionField ? _.get(this.item, this.options.descriptionField, '') : this.item.description
    },
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
    setActions (actions) {
      this.actions = actions
    },
    clearActions () {
      this.actions = null
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
