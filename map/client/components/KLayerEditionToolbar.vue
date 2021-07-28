  <template>
  <div>
  <k-action
    id="add-polygons"
    icon="las la-draw-polygon"
    tooltip="KLayerEditionToolbar.ADD_POLYGON_FEATURES"
    :toggle="{}"
    :toggled="addPolygonsModeToggled"
    @triggered="onAddPolygonsMode" />
  <k-action
    id="add-rectangles"
    icon="las la-vector-square"
    tooltip="KLayerEditionToolbar.ADD_RECTANGLE_FEATURES"
    :toggle="{}"
    :toggled="addRectanglesModeToggled"
    @triggered="onAddRectanglesMode" />
  <k-action
    id="add-lines"
    icon="las la-project-diagram"
    tooltip="KLayerEditionToolbar.ADD_LINE_FEATURES"
    :toggle="{}"
    :toggled="addLinesModeToggled"
    @triggered="onAddLinesMode" />
  <k-action
    id="add-points"
    icon="las la-map-marker"
    tooltip="KLayerEditionToolbar.ADD_POINT_FEATURES"
    :toggle="{}"
    :toggled="addPointsModeToggled"
    @triggered="onAddPointsMode" />
  <k-action
    id="edit-features"
    icon="las la-edit"
    tooltip="KLayerEditionToolbar.EDIT_GEOMETRY"
    :toggle="{}"
    :toggled="editGeometryModeToggled"
    @triggered="onEditGeometryMode" />
  <k-action
    id="drag-features"
    icon="las la-arrows-alt"
    tooltip="KLayerEditionToolbar.DRAG_FEATURES"
    :toggle="{}"
    :toggled="dragModeToggled"
    @triggered="onDragMode" />
  <k-action
    id="remove-features"
    icon="las la-minus"
    tooltip="KLayerEditionToolbar.REMOVE_FEATURES"
    :toggle="{}"
    :toggled="removeModeToggled"
    @triggered="onRemoveMode" />
  <k-action
    id="edit-properties"
    icon="las la-address-card"
    tooltip="KLayerEditionToolbar.EDIT_PROPERTIES"
    :toggle="{}"
    :toggled="editPropertiesModeToggled"
    @triggered="onEditPropertiesMode" />
  </div>
  </template>

  <script>
  export default {
    name: 'k-layer-edition-toolbar',
    inject: ['kActivity'],
    computed: {
      addPolygonsModeToggled () { return this.kActivity.editMode === 'add-polygons' },
      addRectanglesModeToggled () { return this.kActivity.editMode === 'add-rectangles' },
      addLinesModeToggled () { return this.kActivity.editMode === 'add-lines' },
      addPointsModeToggled () { return this.kActivity.editMode === 'add-points' },
      editGeometryModeToggled () { return this.kActivity.editMode === 'edit-geometry' },
      editPropertiesModeToggled () { return this.kActivity.editMode === 'edit-properties' },
      dragModeToggled () { return this.kActivity.editMode === 'drag' },
      removeModeToggled () { return this.kActivity.editMode === 'remove' }
    },
    methods: {
      onAddPolygonsMode () { this.kActivity.setEditMode('add-polygons') },
      onAddRectanglesMode () { this.kActivity.setEditMode('add-rectangles') },
      onAddLinesMode () { this.kActivity.setEditMode('add-lines') },
      onAddPointsMode () { this.kActivity.setEditMode('add-points') },
      onEditGeometryMode () { this.kActivity.setEditMode('edit-geometry') },
      onEditPropertiesMode () { this.kActivity.setEditMode('edit-properties') },
      onDragMode () { this.kActivity.setEditMode('drag') },
      onRemoveMode () { this.kActivity.setEditMode('remove') }
    },
    created () {
      this.$options.components['k-action'] = this.$load('frame/KAction')
    }
  }
  </script>
