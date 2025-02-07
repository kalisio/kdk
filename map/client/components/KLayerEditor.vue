<template>
  <KModalEditor
    id="layer-editor"
    :ref="onEditorCreated"
    service="catalog"
    :objectId="layerId"
    @applied="onLayerEdited"
  />
</template>

<script>
import config from 'config'
import { KModalEditor } from '../../../core/client/components'

export default {
  name: 'k-layer-editor',
  inject: ['kActivity'],
  components: {
    KModalEditor
  },
  props: {
    layerId: {
      type: String,
      required: true
    }
  },
  methods: {
    onEditorCreated (ref) {
      this.editor = ref
    },
    onLayerEdited (updatedLayer) {
      // Actual layer update should be triggerred by real-time event
      // but as we might not always use sockets we should perform it explicitely in this case
      if (config.transport !== 'websocket') {
        if (this.layer.name !== updatedLayer.name) {
          this.kActivity.renameLayer(this.layer.name, updatedLayer.name)
          Object.assign(this.layer, updatedLayer)
        }
      }
    }
  }
}
</script>
