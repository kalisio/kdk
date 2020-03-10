<template>
  <q-toolbar v-if="appBar.title!=''">
    <!--
      Left drawer toggle
     -->
    <q-btn id="left-drawer-toggle" v-if="hasLeftDrawerToggle" flat :dense="$q.screen.lt.md" @click="$emit('left-drawer-toggled')">
      <q-icon name="menu" />
    </q-btn>
    <!--
      Title/subtitle section
     -->
    <q-toolbar-title id="app-bar-title">
      {{ appBar.title }}
      <span slot="subtitle">
        {{ appBar.subtitle }}
      </span>
    </q-toolbar-title>
    <!--
      Toolbar section
     -->
     <k-tool-bar :actions="appBar.toolbar" color="white" :dense="$q.screen.lt.md" />
    <!--
      Menu section
     -->
    <k-overflow-menu :actions="appBar.menu" color="white" :dense="$q.screen.lt.md" />
  </q-toolbar>
</template>

<script>
export default {
  name: 'k-app-bar',
  props: {
    hasLeftDrawerToggle: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      appBar: this.$store.get('appBar')
    }
  },
  computed: {
    hasToolbar () {
      return this.appBar.toolbar && this.appBar.toolbar.length > 0
    },
    hasMenu () {
      return this.appBar.menu && this.appBar.menu.length > 0
    }
  },
  methods: {
    onActionTriggered (action) {
      if (this.hasMenu) this.$refs.menu.hide()
      // If a handler is given call it
      if (action.handler) action.handler()
      // If a route is given activate it
      else if (action.route) this.$router.push(action.route)
    }
  },
  created () {
    // Loads the required components
    this.$options.components['k-tool-bar'] = this.$load('layout/KToolBar')
    this.$options.components['k-overflow-menu'] = this.$load('layout/KOverflowMenu')
  }
}
</script>
