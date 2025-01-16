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
  setup (props) {
    const keyName = `${_.camelCase(props.name)}Activity`
    logger.debug(`[KDK] Reading '${props.name}' activity options with key ${keyName}`)
    const { setCurrentActivity, options: activityOptions } = useActivity(keyName, props.options)
    const { configureLayout, clearLayout, setLayoutMode } = useLayout()
    return {
      activityOptions,
      setCurrentActivity,
      configureLayout,
      clearLayout,
      setLayoutMode
    }
  },
  watch: {
    mode: {
      // [!] cannot be immediate as it is required that the activity is configured first
      handler (value) {
        logger.debug(`[KDK] Setting layout on '${value}' mode`)
        if (value) this.setLayoutMode(value)
      }
    }
  },
  methods: {
    async configure () {
      logger.debug(`[KDK] Configuring '${this.name}' activity`)
      // because this component is wrapped within an AsyncComponent it returns the grand parent
      const concreteActivity = this.$parent.$parent
      // configure the layout
      let customLayout = {}
      if (this.layout) {
        if (typeof this.layout === 'function') customLayout = await this.layout()
        else customLayout = this.layout
      }
      this.configureLayout(_.merge({}, this.activityOptions, customLayout), concreteActivity)
      // set the current activity
      this.setCurrentActivity(concreteActivity)
      // apply the mode if needed
      if (this.mode) this.setLayoutMode(this.mode)
    }
  },
  async mounted () {
    await this.configure()
    // whenever the user abilities are updated, update activity as well
    this.$events.on('user-abilities-changed', this.configure)
  },
  beforeUnmount () {
    logger.debug(`[KDK] Clearing '${this.name}' activity`)
    this.$events.off('user-abilities-changed', this.configure)
    // clear the current activity
    this.setCurrentActivity(null)
    // Clear the layout
    this.clearLayout()
  }
}
</script>
