<template>
  <div>
    <q-tabs v-model="tab" >
      <q-tab name="add" icon="las la-plus" :label="$t('KFavoriteViews.ADD_VIEW')" />
      <q-tab name="views" icon="las la-star" :label="$t('KFavoriteViews.LIST_VIEWS')" />
    </q-tabs>
    <q-tab-panels v-model="tab" animated swipeable vertical transition-prev="jump-up" transition-next="jump-up" >
      <q-tab-panel name="add">
        <k-form ref="form" :schema="viewSchema" />
        <div class="q-pa-sm row justify-center">
          <q-btn :loading="savingView" color="secondary" id="local" :label="$t('KFavoriteViews.ADD_BUTTON')" @click="onAdd" v-close-popup/>
        </div>
      </q-tab-panel>
      <q-tab-panel name="views">
        <k-list ref="list" service="catalog" :renderer="viewRenderer" :base-query="{ type: 'View' }" @collection-refreshed="refreshViews" @selection-changed="selectView"/>
      </q-tab-panel>
    </q-tab-panels>
  </div>
</template>

<script>
import _ from 'lodash'
import { KList } from '../../../core/client/components/collection'
import { KForm } from '../../../core/client/components/form'

export default {
  name: 'k-favorite-views',
  inject: ['kActivity'],
  components: {
    KForm,
    KList
  },
  props: {
    viewRenderer: {
      type: Object,
      default: () => ({
        component: 'collection/KItem',
        props: {
          itemActions: [{ 
            id: 'remove-view', 
            icon: 'las la-trash', 
            tooltip: 'KFavoriteViews.REMOVE_VIEW', 
            handler: (context) => this.removeView(context.item)
          }]
        }
      })
    }
  },
  data () {
    return {
      tab: 'add',
      viewSchema: {
        $schema: 'http://json-schema.org/draft-06/schema#',
        $id: 'http://www.kalisio.xyz/schemas/favorite-views.create.json#',
        title: 'KFavoriteViews.FAVORITE_VIEW_CREATE_TITLE',
        description: 'Favorite view creation schema',
        type: 'object',
        properties: {
          name: {
            type: 'string', 
            maxLength: 128,
            minLength: 3,
            field: {
              component: 'form/KTextField',
              helper: 'KFavoriteViews.FAVORITE_VIEW_NAME_FIELD_HELPER'
            }
          },
          description: {
            type: 'string', 
            maxLength: 256,
            field: {
              component: 'form/KTextField',
              helper: 'KFavoriteViews.FAVORITE_VIEW_DESCRIPTION_FIELD_HELPER'
            }
          },
          layers: {
            type: 'boolean', 
            default: false,
            field: {
              component: 'form/KToggleField',
              helper: 'KFavoriteViews.FAVORITE_VIEW_LAYERS_FIELD_HELPER'
            }
          }
        },
        required: ['name']
      },
      savingView: false
    }
  },
  computed: {
  },
  methods: {
    async onAdd () {
      const result = this.$refs.form.validate()
      if (result.isValid) {
        let view = result.values
        const hasLayers = view.layers
        // This flag is only useful in the form but will be replaced
        // by the actual layers when processed
        delete view.layers
        // Add required type for catalog
        view.type = 'View'
        // Retrieve basic view parameters
        Object.assign(view, this.kActivity.getContextParameters('view'))
        // Add layers parameters if required
        if (hasLayers) {
          Object.assign(view, this.kActivity.getContextParameters('layers'))
        }
        this.savingView = true
        try {
          await this.$api.getService('catalog').create(view)
          this.savingView = false
        } catch (error) {
          this.savingView = false
          throw error
        }
      }
    },
    refreshViews (data) {
      data.items.forEach(view => {
        // Add required icon
        view.icon = { name: (view.isDefault ? 'las la-star' : 'star_border') }
      })
    },
    selectView (view, section) {
      // selecting the avatar makes the view the home view
      if (section === 'avatar') {
        this.homeView(view)
      } else {
        this.kActivity.setContextParameters('view', view)
        this.kActivity.setContextParameters('layers', view)
      }
    },
    async homeView (view) {
      // Get current home view
      const response = await this.$api.getService('catalog').find({ query: { type: 'View', isDefault: true } })
      const currentHomeView = (response.data.length > 0 ? response.data[0] : null)
      // Unset it
      if (currentHomeView) await this.$api.getService('catalog').patch(currentHomeView._id, { isDefault: false })
      // Then set new one
      await this.$api.getService('catalog').patch(view._id, { isDefault: true })
    },
    removeView (view) {
      this.$api.getService('catalog').remove(view._id)
    }
  }
}
</script>
