<template>
  <!--q-list highlight no-border-->
  <div>
    <q-list>
      <template v-for="(link,index) in links">
        <q-item v-if="link.label" :key="index" @click="onLinkClicked(link)" clickable v-ripple>
          <q-item-section avatar><q-icon :name="link.icon"/></q-item-section>
          <q-item-section>{{ $t(link.label) }}</q-item-section>
        </q-item>
        <q-separator v-else :key="index" />
      </template>
    </q-list>
  </div>
</template>

<script>

export default {
  name: 'k-links-panel',
  props: {
    name: {
      type: String,
      default: ''
    }
  },
  inject: ['sideNav'],
  data () {
    return {
      links: []
    }
  },
  methods: {
    onLinkClicked (link) {
      const route = { name: link.route.name }
      if (link.route.params) {
        const resolvedParams = Object.assign({}, link.route.params)
        if (resolvedParams.context) {
          const context = this.$store.get(resolvedParams.context)
          resolvedParams.context = context
        }
        route.params = resolvedParams
      }
      if (link.route.query) {
        route.query = Object.assign({}, this.$route.query)
      }
      this.$router.push(route)
    }
  },
  created () {
    // Load the configuration
    this.links = this.$config(this.name + '.links')
  }
}
</script>
