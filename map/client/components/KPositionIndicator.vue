<template>
  <div id="position-indicator" class="row items-center no-padding">
    <span class="q-pl-md q-pr-md">
      {{ formattedPosition }}
    </span>
    <k-action id="copy-position" icon="las la-copy" tooltip="KPositionIndicator.COPY" :handler="onCopy" />
  </div>
</template>

<script>
import formatcoords from 'formatcoords'
import { copyToClipboard } from 'quasar'

export default {
  name: 'k-position-indicator',
  inject: ['kActivity'],
  data () {
    return {
      position: this.kActivity.getCenter()
    }
  },
  computed: {
    formattedPosition () {
      return formatcoords(this.position.latitude, this.position.longitude).format(this.format)
    }
  },
  methods: {
    updatePosition (event) {      
      this.position = this.kActivity.getCenter()
    },
    async onCopy () {
      try {
        await copyToClipboard(this.position)
        this.$toast({ type: 'positive', message: this.$t('KPositionIndicator.POSITION_COPIED') })
      } catch (_) {
        this.$toast({ type: 'error', message: this.$t('KPositionIndicator.CANNOT_COPY_POSITION') })
      }
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-action'] = this.$load('frame/KAction')
    // Setup the component
    this.format = this.$store.get('locationFormat') || 'FFf'
  },
  mounted () {
    this.kActivity.onToggleTarget()
    this.kActivity.$on('mousemove', this.updatePosition)
  },
  beforeDestroy () {
    this.kActivity.$off('mousemove', this.updatePosition)
    this.kActivity.onToggleTarget()
  }
}
</script>
