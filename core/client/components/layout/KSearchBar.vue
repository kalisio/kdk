<template>
  <div v-show="isVisible" class="row full-width">
    <k-item-chooser
      :multiselect="true"
      :services="services"
      @changed="onItemsChanged" />
  </div>
</template>

<script>
export default {
  name: 'k-search-bar',
  data () {
    return {
      isVisible: false,
      services: []
    }
  },
  methods: {
    setupSearch () {
      const searchBar = this.$store.get('searchBar')
      this.isVisible = (searchBar.isVisible ? searchBar.field !== '' : false)
      this.services = searchBar.services
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
