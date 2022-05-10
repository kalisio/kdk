<template>
  <div>
    <div v-if="readOnly" :id="properties.name + '-field'">
      <k-spot :color="model" width="50px" height="18px" border-radius="3px" />
    </div>
    <q-field v-else
      :for="properties.name + '-field'"
      :label="label"
      :value="model"
      :error-message="errorLabel"
      :error="hasError"
      :disabled="disabled"
      clearable
      bottom-slots
      @click.native="picker = true"
      @clear="model=''">
      <!-- control -->
      <template v-slot:control>
        <k-spot :id="properties.name + '-field'" :color="model" width="50px" height="18px" border-radius="3px" />
        <q-dialog v-model="picker">
          <q-color no-header format-model="hex" v-model="model" @changed="picker = false"/>
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
  name: 'k-datetime-field',
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
    }
  }
}
</script>
