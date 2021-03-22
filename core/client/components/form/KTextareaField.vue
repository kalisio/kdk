<template>
  <k-text-area v-if="readOnly" :text="model"  :length="150" />
  <q-field v-else
    :value="model"
    :label="label"
    :error-message="errorLabel"
    :error="hasError"
    :disabled="disabled"
    bottom-slots
  >
    <!-- Content -->
    <template v-slot:default>
      <q-editor
        class="q-pa-sm full-width"
        :id="properties.name + '-field'"
        v-model="model"
        content-class="text-grey-8"
        min-height="5rem"
        max-height="10rem"
        dense />
    </template>
    <!-- Helper -->
    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>
  </q-field>
</template>

<script>
import mixins from '../../mixins'
import { QEditor } from 'quasar'

export default {
  name: 'k-textarea-field',
  mixins: [mixins.baseField],
  components: {
    QEditor
  },
  created () {
    this.$options.components['k-text-area'] = this.$load('frame/KTextArea')
  }
}
</script>
