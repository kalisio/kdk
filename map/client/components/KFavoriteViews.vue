<template>
  <q-card id="favorite-views">
    <q-card-section>
      <k-panel id="favorite-views-toolbar" :content="toolbar" :mode="mode" class="no-wrap" />
    </q-card-section>
    <q-card-section id="favorite-views-list" v-if="mode === 'list'">
      <k-list
        style="min-height: 50px; min-width: 200px"
        service="catalog"
        :renderer="viewRenderer"
        :nbItemsPerPage="8"
        :base-query="baseQuery"
        :filter-query="filter.query"
        @collection-refreshed="refreshViews"
        @selection-changed="selectView" />
    </q-card-section>
    <q-card-section id="favorite-view-add" v-if="mode === 'add'">
      <k-form ref="form" :schema="viewSchema" style="min-width: 300px" />
    </q-card-section>
    <q-card-actions align="right">
      <k-panel
        id="favorite-views-buttons"
        :content="buttons"
        :action-renderer="'form-button'"
        v-bind:class="{ 'q-gutter-x-md' : $q.screen.gt.xs, 'q-gutter-x-sm': $q.screen.lt.sm }" />
    </q-card-actions>
  </q-card>
</template>

<script>
import { KForm } from '../../../core/client/components/form'

export default {
  name: 'k-favorite-views',
  inject: ['kActivity'],
  components: {
    KForm
  },
  props: {
    closeHandler: {
      type: Function,
      default: null
    }
  },
  computed: {
    baseQuery () {
      return Object.assign({ type: 'Context' }, this.sorter.query)
    },
    toolbar () {
      if (this.mode === 'list') {
        return [
          {
            component: 'collection/KSorter',
            id: 'favorite-views-sorter-options',
            tooltip: 'KFavoriteViews.SORT',
            options: [
              { icon: 'las la-sort-alpha-down', value: { field: 'name', order: 1 }, default: true },
              { icon: 'las la-sort-alpha-up', value: { field: 'name', order: -1 } },
              { icon: 'kdk:clockwise.png', value: { field: 'updatedAt', order: 1 } },
              { icon: 'kdk:anticlockwise.png', value: { field: 'updatedAt', order: -1 } }
            ]
          },
          { component: 'collection/KFilter', style: 'max-width: 200px;' },
          { component: 'QSpace' },
          {
            id: 'add-favorite-view',
            icon: 'kdk:view-plus.png',
            tooltip: 'KFavoriteViews.CREATE_VIEW',
            size: '1rem',
            handler: () => { this.mode = 'add' }
          }
        ]
      } else {
        return []
      }
    },
    buttons () {
      const buttons = []
      if (this.closeHandler) {
        buttons.push({
          id: 'close-button',
          label: 'CLOSE',
          renderer: 'form-button',
          handler: this.closeHandler,
          outline: (this.mode !== 'list')
        })
      }
      if ((this.mode !== 'list') && (this.count > 0)) {
        buttons.push({
          id: 'back-button',
          label: 'KFavoriteViews.BACK_BUTTON',
          renderer: 'form-button',
          outline: true,
          handler: () => { this.mode = 'list' }
        })
      }
      if (this.mode === 'add') {
        buttons.push({
          id: 'create-favorite-view',
          label: 'KFavoriteViews.ADD_BUTTON',
          renderer: 'form-button',
          loading: this.savingView,
          handler: this.onAdd
        })
      }
      return buttons
    }
  },
  data () {
    return {
      filter: this.$store.get('filter'),
      sorter: this.$store.get('sorter'),
      mode: 'list',
      count: 0,
      viewSchema: {
        $schema: 'http://json-schema.org/draft-06/schema#',
        $id: 'http://www.kalisio.xyz/schemas/favorite-view.create.json#',
        title: 'schemas.FAVORITE_VIEW_CREATE_TITLE',
        description: 'Favorite view creation schema',
        type: 'object',
        properties: {
          name: {
            type: 'string',
            maxLength: 128,
            minLength: 3,
            field: {
              component: 'form/KTextField',
              label: 'schemas.FAVORITE_VIEW_NAME_FIELD_LABEL'
            }
          },
          description: {
            type: 'string',
            maxLength: 256,
            field: {
              component: 'form/KTextField',
              label: 'schemas.FAVORITE_VIEW_DESCRIPTION_FIELD_LABEL'
            }
          },
          layers: {
            type: 'boolean',
            default: false,
            field: {
              component: 'form/KToggleField',
              label: 'schemas.FAVORITE_VIEW_LAYERS_FIELD_LABEL'
            }
          }
        },
        required: ['name']
      },
      savingView: false,
      viewRenderer: {
        component: 'collection/KItem',
        actions: [{
          id: 'remove-favorite-favorite-view',
          icon: 'las la-trash',
          tooltip: 'KFavoriteViews.REMOVE_VIEW',
          handler: (context) => this.removeView(context.item)
        }]
      }
    }
  },
  methods: {
    async onAdd () {
      const result = this.$refs.form.validate()
      if (result.isValid) {
        const view = result.values
        this.savingView = true
        try {
          await this.kActivity.saveContext(view)
          this.savingView = false
        } catch (error) {
          this.savingView = false
          throw error
        }
        this.mode = 'list'
      }
    },
    refreshViews (items) {
      this.count = items.length
      if (this.count > 0) {
        items.forEach(view => {
          // Add required icon
          view.icon = { name: (view.isDefault ? 'las la-star' : 'star_border') }
        })
      } else {
        if (!this.filter.pattern) this.mode = 'add'
      }
    },
    selectView (view, section) {
      // Selecting the avatar makes the view the home view
      if (section === 'avatar') {
        this.homeView(view)
      } else {
        this.kActivity.loadContext(view)
      }
    },
    async homeView (view) {
      // Get current home view
      const response = await this.$api.getService('catalog').find({ query: { type: 'Context', isDefault: true } })
      const currentHomeView = (response.data.length > 0 ? response.data[0] : null)
      // Unset it
      if (currentHomeView) await this.$api.getService('catalog').patch(currentHomeView._id, { isDefault: false })
      // Then set new one
      await this.$api.getService('catalog').patch(view._id, { isDefault: true })
    },
    removeView (view) {
      this.$api.getService('catalog').remove(view._id)
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-action'] = this.$load('frame/KAction')
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
    this.$options.components['k-list'] = this.$load('collection/KList')
  }
}
</script>
