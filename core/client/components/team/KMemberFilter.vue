<template>
  <k-action
    id="member-filter"
    icon="las la-filter"
    :color="filters.length > 0 ? 'accent' : 'grey-7'">
    <template v-slot:content>
      <q-popup-proxy 
        id="member-filter-popup" 
        transition-show="scale" 
        transition-hide="scale">
        <q-option-group
          class="q-pl-xs q-pr-md bg-white"
          v-model="filters"
          :options="options"
          type="toggle" />
      </q-popup-proxy>
    </template>
  </k-action>
</template>

<script>
import { QOptionGroup } from 'quasar'
export default {
  name: 'k-member-filter',
  components: {
    QOptionGroup
  },
  inject: ['kActivity'],
  data () {
    return {
      filters: this.kActivity.filters,
      options: []
    }
  },
  watch: {
    filters: function (filters) {
      this.kActivity.filters = filters
    }
  },
  async created () {
    // Load the required components
    this.$options.components['k-action'] = this.$load('frame/KAction')
    // Intiializes the options
    this.options = [
      { label: this.$t('KMemberFilter.OWNER'), value: 'owner' },
      { label: this.$t('KMemberFilter.MANAGER'), value: 'manager' },
      { label: this.$t('KMemberFilter.MEMBER'), value: 'member' },
      { label: this.$t('KMemberFilter.GUEST'), value: 'guest' }
    ]
  }
}
</script>
