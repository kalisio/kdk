<template>
  <k-modal
    id="layer-categorie-modal"
    :title="$t('KLayerCategories.TITLE')"
    v-model="isModalOpened"
    @opened="$emit('opened')"
    @closed="$emit('closed')">
    <div slot="modal-content">
      <q-card-section v-show="hasToolbar">
        <k-panel id="layer-categories-toolbar" :content="toolbar" :mode="mode" class="no-wrap" />
      </q-card-section>
      <q-card-section id="layer-categories-list" v-if="mode === 'list'">
        <k-list
          style="min-height: 50px; min-width: 200px"
          service="catalog"
          :renderer="categoryRenderer"
          :nbItemsPerPage="8"
          :base-query="baseQuery"
          :filter-query="filter.query"
          @collection-refreshed="refreshCategories" />
      </q-card-section>
      <q-card-section id="layer-category-add" v-if="mode === 'add'">
        <div class="colum q-gutter-y-md">
          <k-form ref="addForm" :schema="categorySchema" style="min-width: 300px" />
          <div class="q-pa-sm row justify-end">
            <q-btn
              :loading="savingCategory"
              color="accent"
              id="create-layer-category"
              :label="$t('KLayerCategories.ADD_BUTTON')"
              @click="onAdd" />
          </div>
        </div>
      </q-card-section>
      <q-card-section id="layer-category-edit" v-if="mode === 'edit'">
        <div class="colum q-gutter-y-md">
          <k-form ref="editForm" :schema="categorySchema" style="min-width: 300px" />
          <div class="q-pa-sm row justify-end">
            <q-btn
              :loading="savingCategory"
              color="accent"
              id="edit-layer-category"
              :label="$t('KLayerCategories.EDIT_BUTTON')"
              @click="onEdit" />
          </div>
        </div>
      </q-card-section>
    </div>
  </k-modal>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins } from '../../../../core/client'
import { KForm } from '../../../../core/client/components/form'

export default {
  name: 'k-layer-categories',
  mixins: [
    kCoreMixins.refsResolver(),
    kCoreMixins.baseModal
  ],
  inject: ['kActivity'],
  components: {
    KForm
  },
  computed: {
    baseQuery () {
      return Object.assign({ type: 'Category' }, this.sorter.query)
    },
    hasToolbar () {
      if (this.mode === 'list') return (this.count > 0) || (this.filter.patern !== '')
      return (this.count > 0)
    },
    hasLayers () {
      return this.layers.length > 0
    },
    layers () {
      // User-defined layers only and not in-memory layers
      return _.values(this.kActivity.layers)
        .filter(layer => layer._id && (_.get(layer, 'scope') === 'user'))
        .map(layer => ({ value: layer.name, label: layer.name }))
    },
    categorySchema () {
      return {
        $schema: 'http://json-schema.org/draft-06/schema#',
        $id: 'http://www.kalisio.xyz/schemas/layer-category.create.json#',
        title: 'schemas.LAYER_CATEGORY_CREATE_TITLE',
        description: 'Layer category creation schema',
        type: 'object',
        properties: {
          name: {
            type: 'string',
            maxLength: 128,
            minLength: 3,
            field: {
              component: 'form/KTextField',
              label: 'schemas.LAYER_CATEGORY_NAME_FIELD_LABEL'
            }
          },
          icon: {
            type: 'string',
            default: 'las la-map-marker-alt',
            field: {
              component: 'form/KIconField',
              label: 'schemas.LAYER_CATEGORY_ICON_FIELD_LABEL',
              iconSet: 'line-awesome',
              color: false
            }
          },
          layers: {
            type: 'array',
            field: {
              component: 'form/KSelectField',
              label: 'schemas.LAYER_CATEGORY_LAYERS_FIELD_LABEL',
              multiple: true,
              chips: true,
              options: this.layers
            }
          },
          exclusive: {
            type: 'boolean',
            default: false,
            field: {
              component: 'form/KToggleField',
              label: 'schemas.LAYER_CATEGORY_EXCLUSIVE_FIELD_LABEL'
            }
          }
        },
        required: ['name', 'icon']
      }
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
            id: 'layer-categories-sorter-options',
            tooltip: 'KLayerCategories.SORT',
            options: [
              { icon: 'las la-sort-alpha-down', value: { field: 'name', order: 1 }, default: true },
              { icon: 'las la-sort-alpha-up', value: { field: 'name', order: -1 } },
              { icon: 'kdk:clockwise.png', value: { field: 'updatedAt', order: 1 } },
              { icon: 'kdk:anticlockwise.png', value: { field: 'updatedAt', order: -1 } }
            ]
          },
          { component: 'collection/KFilter', style: 'max-width: 200px;' },
          { component: 'QSpace' },
          { id: 'add-layer-category', icon: 'las la-plus-circle', tooltip: 'KLayerCategories.CREATE_CATEGORY', size: '1rem', handler: () => { this.mode = 'add' } }
        ],
        edit: [
          { id: 'list-layer-categories', icon: 'las la-arrow-left', label: 'KLayerCategories.CATEGORY_LIST', handler: () => { this.mode = 'list' } },
          { component: 'QSpace' }
        ],
        add: [
          { id: 'list-layer-categories', icon: 'las la-arrow-left', label: 'KLayerCategories.CATEGORY_LIST', handler: () => { this.mode = 'list' } },
          { component: 'QSpace' }
        ]
      },
      savingCategory: false,
      categoryRenderer: {
        component: 'collection/KItem',
        actions: [{
          id: 'edit-layer-category',
          icon: 'las la-file-alt',
          tooltip: 'KLayerCategories.EDIT_CATEGORY',
          handler: (context) => this.editCategory(context.item)
        }, {
          id: 'remove-layer-category',
          icon: 'las la-trash',
          tooltip: 'KLayerCategories.REMOVE_CATEGORY',
          handler: (context) => this.removeCategory(context.item)
        }]
      }
    }
  },
  methods: {
    async onAdd () {
      const result = this.$refs.addForm.validate()
      if (result.isValid) {
        const category = result.values
        // Add required type for catalog
        category.type = 'Category'
        this.savingCategory = true
        try {
          await this.$api.getService('catalog').create(category)
          this.savingCategory = false
        } catch (error) {
          this.savingCategory = false
          throw error
        }
        this.mode = 'list'
      }
    },
    async onEdit () {
      const result = this.$refs.editForm.validate()
      if (result.isValid) {
        this.savingCategory = true
        try {
          await this.$api.getService('catalog').patch(this.editedCategory._id, result.values)
          this.savingCategory = false
        } catch (error) {
          this.savingCategory = false
          throw error
        }
        this.editedCategory = null
        this.mode = 'list'
      }
    },
    refreshCategories (data) {
      this.count = data.items.length
      if (this.count > 0) {
        // Add the list of layers as description
        data.items.forEach(category => {
          category.description = category.layers.join(',')
        })
      } else {
        if (!this.filter.pattern) this.mode = 'add'
      }
    },
    async editCategory (category) {
      this.mode = 'edit'
      this.editedCategory = category
      this.setRefs(['editForm'])
      await this.loadRefs()
      await this.$refs.editForm.build()
      this.$refs.editForm.fill(category)
    },
    removeCategory (category) {
      this.$api.getService('catalog').remove(category._id)
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-action'] = this.$load('frame/KAction')
    this.$options.components['k-panel'] = this.$load('frame/KPanel')
    this.$options.components['k-list'] = this.$load('collection/KList')
  }
}
</script>
