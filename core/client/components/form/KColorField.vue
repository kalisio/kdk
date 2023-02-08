<template>
  <div>
    <div v-if="readOnly" :id="properties.name + '-field'">
      <div class="full-width k-color-field" />
    </div>
    <q-field v-else
      :for="properties.name + '-field'"
      :ref="onReferenceCreated"
      :label="label"
      stack-label
      v-model="model"
      :error-message="errorLabel"
      :error="hasError"
      :disable="disabled"
      clearable
      bottom-slots
      @clear="model=''">
      <!-- control -->
      <template v-slot:control>
        <div class="full-width k-color-field" />
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
import { baseField } from '../../mixins'

export default {
  mixins: [baseField],
  data () {
    return {
      picker: false
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
    }
  }
}
</script>

<style lang="scss" scoped>
.k-color-field {
  background-color: v-bind(model);
  height: 16px;
  border-radius: 5px;
}
</style>
