<template>
  <k-text-area v-if="readOnly" :text="model"  :length="150" />
  <q-field v-else
    :value="model"
    :label="label"
    :error-message="errorLabel"
    :error="hasError"
    :disable="disabled"
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
import _ from 'lodash'
import KTextArea from '../KTextArea.vue'
import { baseField } from '../../mixins'

export default {
  mixins: [baseField],
  components: {
    KTextArea
  },
  props: {
    toolbar: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      defaultToolbar: {
        xs: [
          ['bold', 'italic', 'underline', 'strike', 'align'],
          [{
            label: '',
            icon: this.$q.iconSet.editor.align,
            list: 'only-icons',
            options: ['left', 'center', 'right', 'justify']
          }],
          ['undo', 'redo']
        ],
        'gt.xs': [
          ['bold', 'italic', 'underline', 'strike', 'unordered', 'ordered'],
          ['quote', 'link', 'hr'],
          [{
            label: this.$q.lang.editor.align,
            icon: this.$q.iconSet.editor.align,
            fixedLabel: true,
            list: 'only-icons',
            options: ['left', 'center', 'right', 'justify']
          }],
          ['undo', 'redo']
        ]
      }
    }
  },
  computed: {
    editorToolbar () {
      let configuration
      _.forEach(this.properties.toolbar || this.toolbar || this.defaultToolbar, (value, key) => {
        if (_.get(this.$q.screen, key)) {
          configuration = value
          return false
        }
      })
      return configuration
    }
  }
}
</script>
