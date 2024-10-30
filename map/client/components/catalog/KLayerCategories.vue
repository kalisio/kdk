<template>
  <KModal
    id="layer-categories-modal"
    :title="title"
    :toolbar="toolbar"
    :buttons="buttons"
    v-model="isModalOpened"
  >
    <div id="layer-categories-content">
      <q-card-section id="layer-categories-list" v-if="mode === 'list'">
        <KGrid
          style="min-height: 50px; min-width: 200px"
          service="catalog"
          :renderer="categoryRenderer"
          :nbItemsPerPage="12"
          :base-query="baseQuery"
          :filter-query="filter.query"
          :append-items="true"
          @collection-refreshed="refreshCategories"
        />
      </q-card-section>
      <q-card-section id="layer-category-add" v-if="mode === 'add'">
        <KForm
          :ref="onAddFormCreated"
          :schema="categorySchema"
          style="min-width: 300px"
        />
      </q-card-section>
      <q-card-section id="layer-category-edit" v-if="mode === 'edit'">
        <KForm
          :ref="onEditFormCreated"
          :schema="categorySchema"
          style="min-width: 300px"
          @form-ready="onEditFormReady"
        />
      </q-card-section>
    </div>
  </KModal>
</template>

<script>
import _ from 'lodash'
import { mixins as kCoreMixins } from '../../../../core/client'
import { KModal, KGrid, KAction, KPanel, KForm } from '../../../../core/client/components'

export default {
  components: {
    KModal,
    KGrid,
    KAction,
    KPanel,
    KForm
  },
  mixins: [
    kCoreMixins.baseModal
  ],
  inject: ['kActivity'],
  computed: {
    baseQuery () {
      // Built-in categories do not have _id
      return Object.assign({ type: 'Category', _id: { $exists: true } }, this.sorter.query)
    },
    title () {
      if (this.mode === 'add') {
        return this.$t('KLayerCategories.ADD_TITLE')
      } else if (this.mode === 'edit') {
        return this.$t('KLayerCategories.UPDATE_TITLE')
      } else {
        return this.$t('KLayerCategories.TITLE')
      }
    },
    toolbar () {
      if (this.mode === 'list') {
        return [
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
          {
            id: 'add-layer-category',
            icon: 'las la-plus-circle',
            tooltip: 'KLayerCategories.CREATE_CATEGORY',
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
      buttons.push({
        id: 'close-button',
        label: 'CLOSE',
        renderer: 'form-button',
        handler: () => this.closeModal(),
        outline: (this.mode !== 'list')
      })
      if ((this.mode !== 'list') && (this.count > 0)) {
        buttons.push({
          id: 'back-button',
          label: 'KLayerCategories.BACK_BUTTON',
          renderer: 'form-button',
          outline: true,
          handler: () => { this.mode = 'list' }
        })
      }
      if (this.mode === 'add') {
        buttons.push({
          id: 'create-layer-category',
          label: 'KLayerCategories.ADD_BUTTON',
          renderer: 'form-button',
          loading: this.savingCategory,
          handler: this.onAdd
        })
      } else if (this.mode === 'edit') {
        buttons.push({
          id: 'edit-layer-category',
          label: 'KLayerCategories.EDIT_BUTTON',
          renderer: 'form-button',
          loading: this.savingCategory,
          handler: this.onEdit
        })
      }
      return buttons
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
        $schema: 'http://json-schema.org/draft-07/schema#',
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
            multiselect: true,
            field: {
              component: 'form/KSelectField',
              label: 'schemas.LAYER_CATEGORY_LAYERS_FIELD_LABEL',
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
      count: undefined,
      savingCategory: false,
      categoryRenderer: {
        component: 'collection/KItem',
        class: 'col-12',
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
      const result = this.addForm.validate()
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
      const result = this.editForm.validate()
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
    refreshCategories (items) {
      this.count = items.length
      if (this.count > 0) {
        // Add the list of layers as description
        items.forEach(category => {
          if (!_.isEmpty(category.layers)) category.description = category.layers.join(',')
        })
      } else {
        if (this.count === 0 && _.isEmpty(this.filter.pattern)) this.mode = 'add'
      }
    },
    onAddFormCreated (ref) {
      if (ref && !this.addForm) {
        this.addForm = ref
      }
    },
    onEditFormCreated (ref) {
      if (ref && !this.editForm) {
        this.editForm = ref
      }
    },
    onEditFormReady (form) {
      this.editForm.fill(this.editedCategory)
    },
    async editCategory (category) {
      this.mode = 'edit'
      this.editedCategory = category
    },
    removeCategory (category) {
      this.$api.getService('catalog').remove(category._id)
    }
  }
}
</script>
