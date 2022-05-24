<template>
  <KModalEditor
    id="layer-editor"
    :ref="onEditorCreated"
    service="catalog"
    :objectId="layerId"
    :contextId="contextId"
  />
</template>

<script>
import _ from 'lodash'
import { KModalEditor } from '../../../core/client/components'

export default {
  name: 'k-settings-editor',
  inject: ['kActivity'],
  components: {
    KModalEditor
  },
  props: {
    layerId: {
      type: String,
      required: true
    },
    contextId: {
      type: String,
      default: ''
    }
  }
  // FIXME: Actual layer update should be triggerred by real-time event
  // but as we might not always use sockets we should perform it explicitely in this case
}
</script>
