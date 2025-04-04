<template>
  <KPage>
    <slot />
  </KPage>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'
import { useActivity, useLayout } from '../composables'
import KPage from './layout/KPage.vue'

export default {
  components: {
    KPage
  },
  props: {
    name: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      default: () => {},
      validator: (value) => {
        return _.isObject(value)
      }
    },
    layout: {
      type: [Object, Function],
      default: () => null
    },
    mode: {
      type: String,
      default: null
    }
  },
  watch: {
    mode: {
      // [!] It cannot be immediate because the activity must first be configured
      handler (value) {
        logger.debug(`[KDK] Setting layout on '${value}' mode`)
        if (value) this.setLayoutMode(value)
      }
    }
  },
  methods: {
    async configure () {
      // set the current activity
      // because this component is wrapped within an AsyncComponent it returns the grand parent
      const concreteActivity = this.$parent.$parent
      // set the current activity
      this.setCurrentActivity(concreteActivity)
      // configure the activity
      let customLayout = {}
      if (this.layout) {
        if (typeof this.layout === 'function') customLayout = await this.layout()
        else customLayout = this.layout
      }
      const configuration = _.merge({}, this.CurrentActivityContext.config, customLayout)
      this.configureLayout(configuration, concreteActivity)
      logger.debug(`[KDK] Activity ${this.name} configured with`, configuration)
      // apply the mode if needed
      if (this.mode) this.setLayoutMode(this.mode)
    }
  },
  setup (props) {
    const activityName = `${_.camelCase(props.name)}Activity`
    const { CurrentActivityContext, setCurrentActivity } = useActivity(activityName, props.options)
    const { configureLayout, clearLayout, setLayoutMode } = useLayout()
    return {
      CurrentActivityContext,
      setCurrentActivity,
      configureLayout,
      clearLayout,
      setLayoutMode
    }
  },
  async created () {
    await this.configure()
    // whenever the user abilities are updated, update activity as well
    this.$events.on('user-abilities-changed', this.configure)
  },
  beforeUnmount () {
    logger.debug(`[KDK] Clearing '${this.name}' activity`)
    this.$events.off('user-abilities-changed', this.configure)
    // Clear the layout
    this.clearLayout()
  }
}
</script>
