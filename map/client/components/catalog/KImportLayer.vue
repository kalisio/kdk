<template>
   <q-file 
    for="file-input" 
    v-model="pickedFile"
    clearable 
    counter
    :counter-label="counterLabel"
    :accept="accept"
    :label="$t('KLayerImportDialog.INPUT_HINT')" />
</template>

<script>
export default {
  name: 'k-import-layer',
  inject: ['kActivity'],
  props: {
    accept: {
      type: String,
      default: '.json,.geojson,application/json,application/geo+json'
    }
  },
  data () {
    return {
      pickedFile: null
    }
  },
  methods: {
    counterLabel ({ totalSize, filesNumber, maxFiles }) {
      return totalSize
    },
    doImport () {
      if (this.pickedFile) {
        this.$emit('imported', this.pickedFile)
      }
    }
  }
}
</script>
