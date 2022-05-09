export const baseViewer = {
  computed: {
    viewerTitle () {
      // Retuns the schema title
      if (this.getSchema()) {
        const schemaTitle = this.getSchema().title
        return this.$t(schemaTitle, { object: this.getObject() })
      }
      return ''
    }
  },
  methods: {
    getSchemaName () {
      // When used with a service by default use the same name for schema as for service
      let schemaName = this.service + '.get'
      if (this.perspective) {
        schemaName += ('-' + this.perspective)
      }
      return schemaName
    },
    async refresh () {
      // We can then load the schema/object and local refs in parallel
      await Promise.all([
        this.loadSchema(this.getSchemaName()),
        this.loadObject()
      ])
    }
  }
}

