<template>
  <div v-show="isVisible" class="k-search-bar">
    <k-item-chooser
      :multiselect="true"
      :services="services"
      :default-items="items"
      @changed="onItemsChanged" />
  </div>
</template>

<script>
export default {
  name: 'k-search-bar',
  data () {
    return {
      isVisible: false,
      services: [],
      items: []
    }
  },
  methods: {
    setupSearch () {
      const searchBar = this.$store.get('searchBar')
      this.isVisible = (searchBar.isVisible ? searchBar.field !== '' : false)
      this.services = searchBar.services
      this.items = searchBar.items
    },
    onItemsChanged (items, pattern) {
      this.$store.patch('searchBar', { pattern: pattern, items: items })
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-item-chooser'] = this.$load('input/KItemChooser')
    this.setupSearch()
    this.$events.$on('search-bar-changed', this.setupSearch)
  },
  beforeDestroy () {
    this.$events.$off('search-bar-changed', this.setupSearch)
  }
}
</script>

<style lang="stylus">
  .k-search-bar {
    background: #ffffff
    border: solid 1px lightgrey
    border-radius: 5px
    width: 100vw
  }
  .k-search-bar:hover {
    border: solid 1px $primary
    cursor: mouse
  }
</style>
