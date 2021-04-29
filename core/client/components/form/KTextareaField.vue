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
      <div class="q-pt-md full-width">
        <q-editor
          :id="properties.name + '-field'"
          v-model="model"
          :toolbar="editorToolbar"
          content-class="text-grey-8"
          min-height="5rem"
          max-height="10rem"
          dense />
      </div>
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
  props: {
    editorToolbar: {
      type: Array,
      default () {
        return [
          ['bold', 'italic', 'underline', 'strike', 'unordered', 'ordered'],
          ['quote', 'link', 'hr'],
          [{
            label: this.$q.lang.editor.align,
            icon: this.$q.iconSet.editor.align,
            fixedLabel: true,
            options: ['left', 'center', 'right', 'justify']
          }],
          ['undo', 'redo', 'viewsource']
        ]
      }
    }
  },
  created () {
    this.$options.components['k-text-area'] = this.$load('frame/KTextArea')
  }
}
</script>
