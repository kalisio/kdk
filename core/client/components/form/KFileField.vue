<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <q-chip v-if="model.name" icon="las la-cloud-upload-alt">
      {{ model.name }}
    </q-chip>
  </div>
  <q-file v-else
    :for="properties.name + '-field'"
    v-model="file"
    :label="label"
    clearable
    counter
    :accept="getAcceptedTypes()"
    :error="hasError"
    :error-message="errorLabel"
    bottom-slots
    @clear="onFileCleared"
    @input="onFileChanged"
    @rejected="onFileRejected">
    <!-- Helper -->
    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>
  </q-file>
</template>

<script>
import _ from 'lodash'
import { QFile } from 'quasar'
import mixins from '../../mixins'
import Papa from 'papaparse'

export default {
  name: 'k-file-field',
  components: {
    QFile
  },
  mixins: [mixins.baseField],
  data () {
    return {
      file: null
    }
  },
  methods: {
    emptyModel () {
      return {}
    },
    getAcceptedTypes () {
      return _.get(this.properties.field, 'mimeTypes', '')
    },
    onFileCleared () {
      this.error = ''
      this.model = this.emptyModel()
    },
    onFileChanged () {
      const reader = new FileReader()
      reader.addEventListener('loadend', () => {
        this.error = ''
        let content = reader.result
        // Provide JSON object directly in this case
        if (this.getAcceptedTypes().split(',').includes('application/json')) {
          try {
            content = JSON.parse(content)
          } catch (error) {
            this.error = 'KFileField.INVALID_JSON_FILE'
            this.model = this.emptyModel()
            return
          }
        }
        if (this.getAcceptedTypes().split(',').includes('application/geo+json')) {
          const type = _.get(content, 'type')
          if (type !== 'Feature' && type !== 'FeatureCollection') {
            this.error = 'KFileField.INVALID_GEOJSON_FILE'
            this.model = this.emptyModel()
            return
          }
        }
        if (this.getAcceptedTypes().split(',').includes('text/csv')) {
          const result = Papa.parse(content, { skipEmptyLines: true })
          if (result.errors.length > 0) {
            this.error = 'KFileField.INVALID_CSV_FILE'
            this.model = this.emptyModel()
            return
          }
          content = result.data
        }
        this.model = { name: this.file.name, content }
        this.onChanged()
      })
      reader.addEventListener('error', () => {
        this.error = 'KFileField.ERROR_WHILE_LOADING_THE_FILE'
        this.model = this.emptyModel()
      })
      if (this.file) reader.readAsText(this.file)
    },
    onFileRejected (file) {
      this.error = 'KFileField.INVALID_FILE_TYPE'
    }
  }
}
</script>
