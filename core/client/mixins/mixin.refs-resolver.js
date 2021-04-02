import { createQuerablePromise } from '../utils'

export default function refsResolverMixin (refs) {
  return {
    methods: {
      setRefs (refs) {
        this._refs = refs
        // Create the mixin promise if required
        if (!this.refsPromise || this.refsPromise.isFulfilled()) {
          this.refsPromise = createQuerablePromise((resolve, reject) => {
            // Store the resolver to resolve it when required
            this.refsResolver = resolve
          })
        }
      },
      resolveRefs () {
        // If already resolved stop
        if (!this.refsPromise || this.refsPromise.isFulfilled()) return
        // While we don't have anything to resolve stop as well
        if (!this._refs || this._refs.length === 0) return

        const resolvedRefs = this._refs.filter(ref => this.$refs[ref])
        // If none are missing we can resolve the promise
        if (resolvedRefs.length === this._refs.length) {
          this.refsResolver(resolvedRefs)
        }
      },
      loadRefs () {
        // Force a refresh in any case refs are already here
        this.resolveRefs()
        return this.refsPromise
      }
    },
    created () {
      // If the ref list is known at startup this will setup it
      if (refs) this.setRefs(refs)
    },
    mounted () {
      // Initiate a resolution on mount
      this.resolveRefs()
    },
    updated () {
      // Because refs are only availalbe once the underlying component has been updated
      // we need to seek for them at each update until we get them all
      this.resolveRefs()
    }
  }
}
