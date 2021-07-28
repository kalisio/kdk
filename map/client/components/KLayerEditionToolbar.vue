  <template>
  <div>
  <k-action
    id="add-polygons"
    v-if="modeAllowed('add-polygons')"
    icon="las la-draw-polygon"
    tooltip="KLayerEditionToolbar.ADD_POLYGON_FEATURES"
    :toggle="{}"
    :toggled="currentMode === 'add-polygons'"
    @triggered="setMode('add-polygons')" />
  <k-action
    id="add-rectangles"
    v-if="modeAllowed('add-rectangles')"
    icon="las la-vector-square"
    tooltip="KLayerEditionToolbar.ADD_RECTANGLE_FEATURES"
    :toggle="{}"
    :toggled="currentMode === 'add-rectangles'"
    @triggered="setMode('add-rectangles')" />
  <k-action
    id="add-lines"
    v-if="modeAllowed('add-lines')"
    icon="las la-project-diagram"
    tooltip="KLayerEditionToolbar.ADD_LINE_FEATURES"
    :toggle="{}"
    :toggled="currentMode === 'add-lines'"
    @triggered="setMode('add-lines')" />
  <k-action
    id="add-points"
    v-if="modeAllowed('add-points')"
    icon="las la-map-marker"
    tooltip="KLayerEditionToolbar.ADD_POINT_FEATURES"
    :toggle="{}"
    :toggled="currentMode === 'add-points'"
    @triggered="setMode('add-points')" />
  <k-action
    id="edit-features"
    v-if="modeAllowed('edit-geometry')"
    icon="las la-edit"
    tooltip="KLayerEditionToolbar.EDIT_GEOMETRY"
    :toggle="{}"
    :toggled="currentMode === 'edit-geometry'"
    @triggered="setMode('edit-geometry')" />
  <k-action
    id="drag-features"
    v-if="modeAllowed('drag')"
    icon="las la-arrows-alt"
    tooltip="KLayerEditionToolbar.DRAG_FEATURES"
    :toggle="{}"
    :toggled="currentMode === 'drag'"
    @triggered="setMode('drag')" />
  <k-action
    id="remove-features"
    v-if="modeAllowed('remove')"
    icon="las la-minus"
    tooltip="KLayerEditionToolbar.REMOVE_FEATURES"
    :toggle="{}"
    :toggled="currentMode === 'remove'"
    @triggered="setMode('remove')" />
  <k-action
    id="edit-properties"
    v-if="modeAllowed('edit-properties')"
    icon="las la-address-card"
    tooltip="KLayerEditionToolbar.EDIT_PROPERTIES"
    :toggle="{}"
    :toggled="currentMode === 'edit-properties'"
    @triggered="setMode('edit-properties')" />
  </div>
  </template>

  <script>
  export default {
    name: 'k-layer-edition-toolbar',
    inject: ['kActivity'],
    computed: {
      currentMode () { return this.kActivity.layerEditMode }
    },
    methods: {
      modeAllowed (mode) { return this.kActivity.allowedLayerEditModes.indexOf(mode) !== -1 },
      setMode (mode) { return this.kActivity.setEditMode(mode) }
    },
    created () {
      this.$options.components['k-action'] = this.$load('frame/KAction')
    }
  }
  </script>
