import _ from 'lodash'
import sift from 'sift'
import { getIconName, getInitials } from '../utils'
import { Layout } from '../layout'

export default function (name) {
  return {
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
            icon: { name: iconName, color: iconColor || 'primary' }
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
      setActions (actions, filter = {}) {
        // As context is different for each item we need to clone the global action configuration
        // otheriwse context will always reference the last processed item
        this.actions = Layout.bindContent(_.cloneDeep(actions), this)
      },
      clearActions () {
        this.actions = null
      },
      // This method should be overriden in items
      configureActions () {
        let actions = _.get(this.itemOptions, 'actions')
        if (actions) {
          // Apply filtering
          actions = Layout.filterContent(actions, _.get(this.itemOptions, 'filter', {}))
          this.setActions(actions)
        }
        else this.clearActions()
      },
      onItemSelected (section) {
        this.$emit('item-selected', this.item, section)
      }
    },
    beforeCreate () {
      // Identify this item using its name or the route name
      this.itemName = name || _.camelCase(this.$options.name)
      // Default association between activity and related items
      if (this.itemName.endsWith('Activity')) this.itemName = this.itemName.replace('Activity', 'Items')
      // Setup the options
      this.itemOptions = this.$config(this.itemName)
    },
    created () {
      // Register the actions
      this.configureActions()
      // Whenever the user abilities are updated, update actions as well
      this.$events.$on('user-abilities-changed', this.configureActions)
    },
    beforeDestroy () {
      this.$events.$off('user-abilities-changed', this.configureActions)
    }
  }
}

