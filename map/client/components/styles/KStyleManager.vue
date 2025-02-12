<template>
  <div class="column">
    <div class="row justify-center">

      <q-tab-panels v-model="viewMode" animated style="width: 100%">
        <q-tab-panel name="list">
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
                    handler: editStyle
                  },
                  {
                    id: 'delete-style',
                    icon: 'las la-trash',
                    tooltip: 'KStyleManager.DELETE',
                    scope: 'footer',
                    handler: { name: 'removeItem', params: ['confirm'] }
                  },
                ],
                class: 'col-12'
              }"
          />
        </q-tab-panel>
        <q-tab-panel name="edit">
          <k-style-editor/>
        </q-tab-panel>
      </q-tab-panels>

    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import _ from 'lodash'
import { KGrid } from '../../../../core/client/components'
import { Store } from '@kalisio/kdk/core.client'
import KStyleEditor from './KStyleEditor.vue'

// Data
const filter = Store.get('filter')
const viewMode = ref('list')

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
  viewMode.value = 'edit'
}

</script>
