<template>
   <k-editor 
    service="catalog" 
    :contextId="contextId"
    :baseObject="baseObject" 
    @applied="onCreated" />
</template>

<script>
export default {
  name: 'k-create-layer',
  inject: ['kActivity'],
  data () {
    return {
      contextId: this.kActivity.contextId,
      baseObject: {
        type: 'OverlayLayer',
        icon: 'insert_drive_file',
        service: 'features',
        featureId: '_id',
        [this.kActivity.engine]: {
          type: 'geoJson',
          isVisible: true,
          realtime: true,
          source: '/api/features'
        }
      }
    }
  },
  methods: {
    async onCreated (createdLayer) {
      createdLayer = await this.$api.getService('catalog').patch(createdLayer._id, { baseQuery: { layer: createdLayer._id } })
      // Create an empty layer used as a container
      await this.kActivity.addLayer(createdLayer)
      // Start editing
      await this.kActivity.onEditLayerData(createdLayer)
      this.$emit('done')
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-editor'] = this.$load('editor/KEditor')
  }
}
</script>
