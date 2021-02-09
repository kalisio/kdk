<template>
  <k-page padding>
    <template v-slot:page-content>
      <!--
        Component view
       -->
      <template v-for="component in components">
        <component
          v-if="component.page === page"
          :key="component.uid"
          :is="component.componentKey"
          v-bind="component" />
      </template>
       <!--
        Router view to enable routing to modals
      -->
      <router-view :router="router()"></router-view>
    </template>
  </k-page>
</template>

<script>
import logger from 'loglevel'
import _ from 'lodash'
import path from 'path'
import { uid } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-switch',
  mixins: [mixins.baseActivity()],
  props: {
    page: {
      type: String,
      required: true
    }
  },
  computed: {
    components () {
      const components = []
      _.forOwn(this.activityOptions.pages, (component, page) => {
        const componentName = _.get(component, 'component', undefined)
        if (componentName) {
          const componentKey = _.kebabCase(path.basename(componentName))
          // Load the component if needed. That is to say, do not load any Quasar component and if it has not already been loaded
          if (!this.$options.components[componentKey]) this.$options.components[componentKey] = this.$load(componentName)
          // Add the required properties
          component['componentKey'] = componentKey
          component['uid'] = uid()
          component['page'] = page
          components.push(component)
        } else {
          logger.debug(`invalid page ${page}: it must contain a component property` )
        }
      })
      return components
    }
  },
  watch: {
    page: function (page) {
      this.setTopPaneMode(page)
    }
  },
  methods: {
    router () {
      return {
        onApply: { name: _.kebabCase(this.activityName) },
        onDismiss: { name: _.kebabCase(this.activityName) }
      }
    },
    refreshActivity () {
      // Nothing to do. Avoid to clear and configure
    },
    restoreTopPaneMode () {
      this.setTopPaneMode(this.page)
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-page'] = this.$load('layout/KPage')
    // Configure once the activity
    this.configureActivity()
    // Setup the pane mode according the current page
    this.restoreTopPaneMode()
  }
}
</script>
