<template>
  <div class="column">
    <div class="row justify-center">
      <KGrid
        service="styles"
        :base-query="baseQuery"
        :filter-query="filterQuery"
     />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { KGrid } from '../../../../core/client/components'
import { Store } from '@kalisio/kdk/core.client'


const filter = Store.get('filter')

// computed
const baseQuery = computed(() => {
  // Filter the objets of type of table
  const query = { type: 'table' }
  return query
})
const filterQuery = computed(() => {
  const query = _.clone(filter.query)
  // Filter the objects against the group
  return query
})


</script>
