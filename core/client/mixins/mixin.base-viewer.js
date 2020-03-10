import logger from 'loglevel'

export default function baseViewerMixin (viewRefs) {
  return {
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
      fillViewer () {
        // Iterate over forms
        viewRefs.forEach(name => {
          const view = this.$refs[name]
          if (view.loadRefs().isFulfilled()) {
            if (this.getObject()) {
              if (this.perspective !== '') {
                view.fill(this.getObject()[this.perspective])
              } else {
                view.fill(this.getObject())
              }
            } else {
              view.clear()
            }
          } else {
            logger.warn(`Trying to fill the viewer with a non-ready form named ${name}`)
          }
        })
      },
      getSchemaName () {
        // When used with a service by default use the same name for schema as for service
        let schemaName = this.service + '.get'
        if (this.perspective) {
          schemaName += ('-' + this.perspective)
        }
        return schemaName
      },
      async refresh () {
        // When the service is available
        await this.loadService()
        // We can then load the schema/object and local refs in parallel
        await Promise.all([
          this.loadSchema(this.getSchemaName()),
          this.loadObject(),
          this.loadRefs()
        ])
        // We finally build the forms then fill it
        await Promise.all(viewRefs.map(name => this.$refs[name].build()))
        this.fillViewer()
        this.$emit('viewer-ready', this)
      }
    }
  }
}
