<template>
  <div class="row items-center justify-center">
    <q-chip class="ellipsis" text-color="accent" icon="las la-layer-group" :label="layerLabel"/>
    <k-panel id="toolbar-buttons" :content="buttons" action-renderer="button"/>
  </div>
</template>

<script>
import { KPanel } from '../../../core/client/components'

export default {
  name: 'k-layer-edition-toolbar',
  inject: ['kActivity'],
  components: {
    KPanel
  },
  computed: {
    layerLabel () {
      return _.get(this.kActivity.editedLayer, 'label', _.get(this.kActivity.editedLayer, 'name'))
    },
    editMode () {
      return this.kActivity.layerEditMode
    },
    buttons () {
      const allEditModes = [
        { id: 'add-polygons', icon: 'las la-draw-polygon', toggled: this.editMode === 'add-polygons', tooltip: 'KLayerEditionToolbar.ADD_POLYGON_FEATURES', handler: () => { this.setMode('add-polygons') } },
        { id: 'add-rectangles', icon: 'las la-vector-square', toggled: this.editMode === 'add-rectangles', tooltip: 'KLayerEditionToolbar.ADD_RECTANGLE_FEATURES', handler: () => { this.setMode('add-rectangles') } },
        { id: 'add-lines', icon: 'las la-project-diagram', toggled: this.editMode === 'add-lines', tooltip: 'KLayerEditionToolbar.ADD_LINE_FEATURES', handler: () => { this.setMode('add-lines') } },
        { id: 'add-points', icon: 'las la-map-marker', toggled: this.editMode === 'add-points', tooltip: 'KLayerEditionToolbar.ADD_POINT_FEATURES', handler: () => { this.setMode('add-points') } },
        { id: 'edit-geometry', icon: 'las la-edit', toggled: this.editMode === 'edit-geometry', tooltip: 'KLayerEditionToolbar.EDIT_GEOMETRY', handler: () => { this.setMode('edit-geometry') } },
        { id: 'edit-properties', icon: 'las la-address-card', toggled: this.editMode === 'edit-properties', tooltip: 'KLayerEditionToolbar.EDIT_PROPERTIES', handler: () => { this.setMode('edit-properties') } },
        { id: 'drag', icon: 'las la-arrows-alt', toggled: this.editMode === 'drag', tooltip: 'KLayerEditionToolbar.DRAG_FEATURES', handler: () => { this.setMode('drag') } },
        { id: 'rotate', icon: 'las la-sync', toggled: this.editMode === 'rotate', tooltip: 'KLayerEditionToolbar.ROTATE_FEATURES', handler: () => { this.setMode('rotate') } },
        { id: 'remove', icon: 'las la-trash', toggled: this.editMode === 'remove', tooltip: 'KLayerEditionToolbar.REMOVE_FEATURES', handler: () => { this.setMode('remove') } }
      ]
      const buttons = []
      for (const mode of allEditModes) {
        if (!this.modeAllowed(mode.id)) continue
        buttons.push(mode)
      }

      return buttons
    }
  },
  methods: {
    modeAllowed (mode) {
      return this.kActivity.allowedLayerEditModes.indexOf(mode) !== -1
    },
    setMode (mode) {
      return this.kActivity.setEditMode(mode)
    }
  }
}
</script>
