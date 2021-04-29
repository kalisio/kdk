export const CanvasDrawContext = {
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

CanvasDrawContext.initialize()
