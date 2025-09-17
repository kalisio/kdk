<template>
  <div>
    <div class="fit">
      <KGrid
        service="tags"
        :renderer="viewRenderer"
        :nb-items-per-page="24"
        :append-items="true"
        :base-query="baseQuery"
        :filter-query="filterQuery"
        :dense="true"
        :scrollToTop="false"
        :header="toolbar"
        header-class="full-width no-wrap"
      />
    </div>
    <KFollower
      :follower="follower"
      targetId="left-window-magnet"
      anchor="bottom-right"
    />
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed, watch, onMounted } from 'vue'
import { KGrid } from '..'
import KFollower from '../KFollower.vue'

// Props
const props = defineProps({
  services: {
    type: Array,
    required: true
  }
})

// Data
const baseQuery = ref({ $sort: { name: 1 } })
const filterQuery = ref({})
const baseSchema = ref(null)
const follower = ref({
  component: 'layout/KFab',
  direction: 'up',
  alignment: 'right',
  content: [{
    id: 'create-tag',
    icon: 'las la-plus',
    tooltip: 'KTagManager.CREATE_TAG',
    dialog: {
      title: 'KTagManager.CREATE_TAG',
      component: 'KEditor',
      service: 'tags',
      object: ':item',
      hideButtons: true,
      baseObject: getBaseObject(),
      beforeRequest: (values) => {
        // If more than one service is available, we need to set the property in which the tags will be stored
        if (!_.isEmpty(props.services) && props.services.length > 1) {
          _.forEach(props.services, (service) => {
            if (service.name === values.service) {
              values.property = service.property
            }
          })
          if (!_.get(values, 'property')) return { isOk: false }
        }
        return { isOk: true, values }
      },
      schema: {},
      cancelAction: 'CANCEL',
      okAction: {
        id: 'ok-button',
        label: 'CREATE',
        handler: 'apply'
      }
    }
  }]
})

// Computed
const toolbar = computed(() => {
  return [
    {
      id: 'tags-filter',
      component: 'collection/KItemsFilter',
      class: 'col q-ml-sm',
      onSearch: (value) => {
        if (_.isEmpty(value)) {
          filterQuery.value = {}
        } else {
          filterQuery.value = { name: { $regex: value } }
        }
      }
    },
    {
      component: 'collection/KItemsSorter',
      id: 'tags-sorter',
      class: 'q-mr-sm',
      tooltip: 'KTagManager.SORT_TAGS',
      options: [
        { icon: 'las la-sort-alpha-down', value: { field: 'name', order: 1 }, default: true },
        { icon: 'las la-sort-alpha-up', value: { field: 'name', order: -1 } }
      ],
      onOptionChanged: (option) => {
        baseQuery.value = { $sort: { [option.field]: option.order } }
      }
    }
  ]
})
const schema = computed(() => {
  const tagSchema = _.cloneDeep(baseSchema.value)

  if (!hasOneService()) {
    tagSchema.properties.service = {
      type: 'string',
      field: {
        component: 'form/KSelectField',
        label: 'KTagManager.TAG_SERVICE',
        options: props.services.map(service => {
          return { label: service.label, value: service.name }
        })
      }
    }
    tagSchema.required.push('service')
  }

  return tagSchema
})
const viewRenderer = computed(() => {
  return {
    component: 'tags/KTagItem',
    class: 'col-12',
    actions: [{
      id: 'tag-menu',
      component: 'menu/KMenu',
      dropdownIcon: 'las la-ellipsis-v',
      actionRenderer: 'item',
      propagate: false,
      dense: true,
      content: [
        {
          id: 'edit-tag',
          icon: 'las la-edit',
          label: 'KTagManager.EDIT_TAG',
          dialog: {
            title: ':item.name',
            component: 'KEditor',
            service: 'tags',
            object: ':item',
            hideButtons: true,
            schema: schema.value,
            cancelAction: 'CANCEL',
            okAction: {
              id: 'ok-button',
              label: 'UPDATE',
              handler: 'apply'
            }
          }
        },
        {
          id: 'delete-tag',
          icon: 'las la-trash',
          label: 'KTagManager.DELETE_TAG',
          handler: { name: 'removeItem', params: ['confirm'] }
        }
      ]
    }],
    options: {
      avatar: false
    }
  }
})

// Watch
watch(schema, (newSchema) => {
  follower.value.content[0].dialog.schema = newSchema
})

// Functions
function hasOneService () {
  return !_.isEmpty(props.services) && props.services.length === 1
}
function getBaseObject () {
  const object = { scope: 'user' }
  if (hasOneService()) {
    object.service = _.get(props, 'services.[0].name')
    object.property = _.get(props, 'services.[0].property')
  }
  return object
}

onMounted(async () => {
  const schema = await import('@schemas/tags.update.json')
  baseSchema.value = schema.default
})

</script>
