<template>
  <q-card id="favorite-views">
    <q-card-section v-show="hasToolbar">
      <k-panel id="favorite-views-toolbar" :content="toolbar" :mode="mode" class="no-wrap" />
    </q-card-section>
    <q-card-section id="favorite-views-list" v-show="mode === 'list'">
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
    <q-card-section id="favorite-views-add" v-if="mode === 'add'">
      <div class="colum q-gutter-y-md">
        <k-form ref="form" :schema="viewSchema" style="min-width: 300px" />
        <div class="q-pa-sm row justify-end">
          <k-action
            id="create-view"
            :label="$t('KFavoriteViews.SAVE_BUTTON')"
            renderer="form-button"
            :loading="savingView"
            @triggered="onSave" />
        </div>
      </div>
    </q-card-section>
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
  computed: {
    baseQuery () {
      return Object.assign({ type: 'Context' }, this.sorter.query)
    },
    hasToolbar () {
      if (this.mode === 'list') return this.count > 0 || this.filter.patern !== ''
      return this.count > 0
    }
  },
  data () {
    return {
      filter: this.$store.get('filter'),
      sorter: this.$store.get('sorter'),
      mode: 'list',
      count: 0,
      toolbar: {
        list: [
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
          { id: 'add-favorite-view', icon: 'kdk:view-plus.png', tooltip: 'KFavoriteViews.CREATE_VIEW', size: '1rem', handler: () => { this.mode = 'add' } }
        ],
        add: [
          { id: 'list-favorite-views', icon: 'las la-arrow-left', label: 'KFavoriteViews.VIEW_LIST', handler: () => { this.mode = 'list' } },
          { component: 'QSpace' }
        ]
      },
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
          id: 'remove-view',
          icon: 'las la-trash',
          tooltip: 'KFavoriteViews.REMOVE_VIEW',
          handler: (context) => this.removeView(context.item)
        }]
      }
    }
  },
  methods: {
    async onSave () {
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
    refreshViews (data) {
      this.count = data.items.length
      if (this.count > 0) {
        data.items.forEach(view => {
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
