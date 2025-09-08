<template>
  <KTextArea v-if="readOnly"
    :text="model"
    :length="150"
  />
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
          :definitions="definitions"
          :toolbar="editorToolbar"
          :content-style="{ overflowWrap: 'anywhere' }"
          content-class="text-grey-8"
          min-height="5rem"
          max-height="10rem"
          dense
        />
      </div>
    </template>
    <!-- Helper -->
    <template v-if="hasHelper" v-slot:append>
      <KAction
        :id="properties.name + '-helper'"
        :label="helperLabel"
        :icon="helperIcon"
        :tooltip="helperTooltip"
        :url="helperUrl"
        :dialog="helperDialog"
        :context="helperContext"
        @dialog-confirmed="onHelperDialogConfirmed"
        color="primary"
      />
    </template>
  </q-field>
</template>

<script>
import _ from 'lodash'
import { baseField } from '../../mixins'
import KTextArea from '../KTextArea.vue'

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
      definitions: {
        clear: {
          tip: this.$t('KTextAreaField.CLEAR_TOOLTIP'),
          icon: 'cancel',
          handler: this.clear
        }
      },
      defaultToolbar: {
        xs: [
          ['bold', 'italic', 'underline', 'strike', 'align'],
          [{
            label: '',
            icon: this.$q.iconSet.editor.align,
            list: 'only-icons',
            options: ['left', 'center', 'right', 'justify']
          }],
          ['undo', 'redo'],
          ['clear']
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
          ['undo', 'redo'],
          ['clear']
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
  },
  methods: {
    emptyModel () {
      return ''
    }
  }
}
</script>
