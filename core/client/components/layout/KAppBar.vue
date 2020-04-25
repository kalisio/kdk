<template>
  <q-toolbar v-if="appBar.title!=''" class="q-pa-xs">
    <!--
      Leading action
     -->
    <q-btn v-if="appBar.leading" id="app-bar-leading" :icon="appBar.leading.icon" flat :dense="$q.screen.lt.md" @click="onLeadingClicked" />
    <!--
      Title/subtitle
     -->
    <q-toolbar-title id="app-bar-title">
      {{ appBar.title }}
      <span slot="subtitle">
        {{ appBar.subtitle }}
      </span>
    </q-toolbar-title>
    <!--
      Actions
     -->
    <k-tool-bar :actions="appBar.toolbar" color="white" :dense="$q.screen.lt.md" />
    <!--
      Overflow menu
     -->
    <k-overflow-menu :actions="appBar.menu" color="white" :dense="$q.screen.lt.md" />
  </q-toolbar>
</template>

<script>
export default {
  name: 'k-app-bar',
  data () {
    return {
      appBar: this.$store.get('appBar')
    }
  },
  methods: {
    onLeadingClicked () {
      const leading = this.appBar.leading
      if (leading.handler) leading.handler()
      else if (leading.route) this.$router.push(leading.route)
    }
  },
  created () {
    // Loads the required components
    this.$options.components['k-tool-bar'] = this.$load('layout/KToolBar')
    this.$options.components['k-overflow-menu'] = this.$load('layout/KOverflowMenu')
  }
}
</script>
