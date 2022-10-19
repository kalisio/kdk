<template>
  <div>
    <div v-if="readOnly" :id="properties.name + '-field'">
      <KShape
        :color="model"
        :width="16"
        :height="16"
        :border-radius="5" />
    </div>
    <q-field v-else
      :for="properties.name + '-field'"
      :ref="onReferenceCreated"
      :label="label"
      v-model="model"
      :error-message="errorLabel"
      :error="hasError"
      :disable="disabled"
      clearable
      bottom-slots
      @clear="model=''">
      <!-- control -->
      <template v-slot:control>
        <q-resize-observer @resize="onResized" />
        <KShape
          :id="properties.name + '-field'"
          type="rect"
          :color="model"
          :width="width"
          :height="16"
          :border-radius="5"
        />
        <q-dialog v-model="picker">
          <q-color
            no-header
            format-model="hex"
            v-model="model"
            default-view="palette"
          />
        </q-dialog>
      </template>
      <!-- Helper -->
      <template v-if="helper" v-slot:hint>
        <span v-html="helper"></span>
      </template>
    </q-field>
  </div>
</template>

<script>
import KShape from '../media/KShape.vue'
import { baseField } from '../../mixins'

export default {
  components: {
    KShape
  },
  mixins: [baseField],
  data () {
    return {
      picker: false,
      width: 16
    }
  },
  methods: {
    emptyModel () {
      return ''
    },
    onReferenceCreated (ref) {
      // https://github.com/quasarframework/quasar/issues/8956
      if (ref) {
        ref.$el.onclick = () => { this.picker = true }
      }
    },
    onResized (size) {
      this.width = size.width
    }
  }
}
</script>
