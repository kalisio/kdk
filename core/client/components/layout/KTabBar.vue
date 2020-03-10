<template>
  <div v-show="hasTabs">
    <q-tabs
      class="bg-secondary text-white shadow-2"
      align="justify"
      inline-label
      :dense="$q.screen.lt.sm"
      @select="onCurrentTabChanged">
      <template v-for="tab in tabBar.tabs">
        <q-route-tab
          :id="tab.id"
          :key="tab.uid"
          :default="tab.default"
          :name="tab.name"
          :label="tab.label"
          :icon="$q.screen.lt.sm ? '' : tab.icon"
          :to="tab.route" />
      </template>
    </q-tabs>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'k-tab-bar',
  data () {
    return {
      tabBar: this.$store.get('tabBar')
    }
  },
  computed: {
    hasTabs () {
      return this.tabBar.tabs && this.tabBar.tabs.length > 0
    }
  },
  methods: {
    onCurrentTabChanged (newTab) {
      if (this.$route.name !== newTab) {
        const tab = _.find(this.tabs, tab => tab.name === newTab)
        if (tab) {
          // If a handler is given call it
          if (tab.handler) tab.handler.call(this)
          // If a route is given activate it
          if (tab.route) this.$router.push(tab.route)
        }
      }
    }
  }
}
</script>
