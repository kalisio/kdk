<template>
  <div class="col">
    <!--
      Banner
     -->
    <div v-if="banner != ''" class="row justify-center items-center banner-container">
      <img class="banner-image" :src="banner">
    </div>
    <!--
      Components
     -->
    <div class="row justify-start">
      <template v-for="component in components">
        <component class="col-12" :key="component.name" :is="component.renderer" :name="component.name" />
      </template>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'k-side-nav',
  provide () {
    return {
      sideNav: this
    }
  },
  data () {
    return {
      banner: '',
      components: []
    }
  },
  methods: {
    navigate (route) {
      this.$router.push(route)
    }
  },
  created () {
    this.banner = this.$config('sideNav.banner', 'kalisio-banner.png')
    if (this.banner) this.banner = this.$load(this.banner, 'asset')
    // Setup the components structure
    // We build an array of components using the SideNav properties
    // A component is defined with
    //   - the renderer: the Vue component to be used for the rendering
    //   - the name: the key to retrieve the configuration
    const content = this.$config('sideNav.components', {})
    Object.entries(content).forEach(element => {
      // Setup the component
      const component = {}
      component.name = element[0]
      const componentClass = element[1]
      if (componentClass) {
        component.renderer = _.kebabCase(_.last(_.split(componentClass, '/')))
        // Load the renderer
        if (!this.$options.components[component.renderer]) {
          this.$options.components[component.renderer] = this.$load(componentClass)
        }
        // Add the component to the components array
        this.components.push(component)
      }
    })
  }
}
</script>

<style>
  .banner-container {
    padding-top: 1rem;
    padding-bottom: 0.5rem;
  }
  .banner-image {
    max-width: 300px;
    max-height: 100px;
    width: auto;
    height: auto;
  }
</style>
