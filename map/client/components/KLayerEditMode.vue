  <template>
  <div>
  <k-action
    id="add-polygons"
    icon="las la-draw-polygon"
    tooltip="KLayerEditMode.ADD_POLYGON_FEATURES"
    :toggle="{}"
    :toggled="addPolygonsModeToggled"
    @triggered="onAddPolygonsMode" />
  <k-action
    id="add-rectangles"
    icon="las la-vector-square"
    tooltip="KLayerEditMode.ADD_RECTANGLE_FEATURES"
    :toggle="{}"
    :toggled="addRectanglesModeToggled"
    @triggered="onAddRectanglesMode" />
  <k-action
    id="add-lines"
    icon="las la-project-diagram"
    tooltip="KLayerEditMode.ADD_LINE_FEATURES"
    :toggle="{}"
    :toggled="addLinesModeToggled"
    @triggered="onAddLinesMode" />
  <k-action
    id="add-points"
    icon="las la-map-marker"
    tooltip="KLayerEditMode.ADD_POINT_FEATURES"
    :toggle="{}"
    :toggled="addPointsModeToggled"
    @triggered="onAddPointsMode" />
  <k-action
    id="edit-features"
    icon="las la-edit"
    tooltip="KLayerEditMode.EDIT_FEATURES"
    :toggle="{}"
    :toggled="editModeToggled"
    @triggered="onEditMode" />
  <k-action
    id="drag-features"
    icon="las la-arrows-alt"
    tooltip="KLayerEditMode.DRAG_FEATURES"
    :toggle="{}"
    :toggled="dragModeToggled"
    @triggered="onDragMode" />
  <k-action
    id="remove-features"
    icon="las la-minus"
    tooltip="KLayerEditMode.REMOVE_FEATURES"
    :toggle="{}"
    :toggled="removeModeToggled"
    @triggered="onRemoveMode" />
  </div>
  </template>

  <script>
  export default {
    name: 'k-layer-edit-mode',
    inject: ['kActivity'],
    computed: {
      addPolygonsModeToggled () { return this.kActivity.editMode === 'add-polygons' },
      addRectanglesModeToggled () { return this.kActivity.editMode === 'add-rectangles' },
      addLinesModeToggled () { return this.kActivity.editMode === 'add-lines' },
      addPointsModeToggled () { return this.kActivity.editMode === 'add-points' },
      editModeToggled () { return this.kActivity.editMode === 'edit' },
      dragModeToggled () { return this.kActivity.editMode === 'drag' },
      removeModeToggled () { return this.kActivity.editMode === 'remove' }
    },
    methods: {
      onAddPolygonsMode () { this.kActivity.setEditMode('add-polygons') },
      onAddRectanglesMode () { this.kActivity.setEditMode('add-rectangles') },
      onAddLinesMode () { this.kActivity.setEditMode('add-lines') },
      onAddPointsMode () { this.kActivity.setEditMode('add-points') },
      onEditMode () { this.kActivity.setEditMode('edit') },
      onDragMode () { this.kActivity.setEditMode('drag') },
      onRemoveMode () { this.kActivity.setEditMode('remove') }
    },
    created () {
      this.$options.components['k-action'] = this.$load('frame/KAction')
    }
  }
  </script>
