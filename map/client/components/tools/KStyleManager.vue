<template>
  <div class="column">
    <div class="row justify-center">
      <KGrid
        service="styles"
        :append-items="true"
        :base-query="baseQuery"
        :filter-query="filterQuery"
        class="fit"
        :renderer="{
          component: 'collection/KItem',
          actions: [
            {
              id: 'edit-style',
              icon: 'las la-edit',
              tooltip: 'KStyleManager.EDIT',
              scope: 'header',
              handler: (context) => this.editStyle(context.item)
            },
            {
              id: 'delete-style',
              icon: 'las la-trash',
              tooltip: 'KStyleManager.DELETE',
              scope: 'footer',
              handler: (context) => this.deleteStyle(context.item)
            },
          ],
          class: 'col-12'
        }"
     />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { KGrid } from '../../../../core/client/components'
import { Store } from '@kalisio/kdk/core.client'

// Data
const filter = Store.get('filter')

// Computed
const baseQuery = computed(() => {
  // Filter the objets of type of table
  const query = { }
  return query
})
const filterQuery = computed(() => {
  const query = _.clone(filter.query)
  // Filter the objects against the group
  return query
})

function editStyle (style) {
  console.log(style)
}
function deleteStyle (style) {
  console.log(style)
}

</script>
