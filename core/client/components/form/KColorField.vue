<template>
  <div>
    <div v-if="readOnly" :id="properties.name + '-field'">
      <k-spot :color="model" width="50px" height="18px" border-radius="3px" />
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
        <k-spot 
          :id="properties.name + '-field'" 
          class="full-width"
          :color="model" 
          width="100%" 
          height="16px" 
          border-radius="3px" 
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
import KSpot from '../frame/KSpot.vue'
import { baseField } from '../../mixins'

export default {
  components: {
    KSpot
  },
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
      if (ref) ref.$el.onclick = () => { this.picker = true }
    }
  }
}
</script>
