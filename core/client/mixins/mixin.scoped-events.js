import Emitter from 'tiny-emitter'

export const scopedEvents = {
  created () {
    this.$scopedEvents = new Emitter()
  }
}
