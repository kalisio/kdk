// This is a singleton used to inject data in string template evaluation contexts (lodash)
export const TemplateContext = {
  initialize () {
    if (this.ctx) return
    this.ctx = {}
  },

  get () {
    return this.ctx
  },

  merge (ctx) {
    this.ctx = Object.assign({}, this.ctx, ctx)
  }
}

TemplateContext.initialize()
