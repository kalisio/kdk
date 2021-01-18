<template>
  <div class="row items-center no-padding">
    <q-icon name="las la-crosshairs" round flat dense size="sm" class="text-grey-7" />
    <span class="q-pl-md q-pr-md">
      {{ position }}
    </span>
    <k-panel id="positionbox-actions" v-if="!isActive" :content="actions" color="primary" />
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
      position: '',
      selection: this.$store.get('selection'),
      format: this.$store.get('locationFormat') || 'FFf',
      actions: [],
      isActive: false
    }
  },
  watch: {
    'selection.location': function () {
      this.stop()
    }
  },
  methods: {
    start () {
      this.kActivity.setCursor('position-cursor')
      this.kActivity.$on('mousemove', this.onMoved)
      this.isActive = true
    },
    stop () {
      this.isActive = false
      this.kActivity.$off('mousemove', this.onMoved)
      this.kActivity.unsetCursor('position-cursor')
    },
    async onCopy () {
      try {
        await copyToClipboard(this.position)
        this.$toast({ type: 'positive', message: this.$t('KPositionIndicator.POSITION_COPIED') })
      } catch (_) {
        this.$toast({ type: 'error', message: this.$t('KPositionIndicator.CANNOT_COPY_POSITION') })
      }
    },
    onClear () {
      this.position = this.$t('KPositionIndicator.PLACEHOLDER')
      this.start()
    },
    onMoved (options, event) {
      if (event.latlng) this.position = formatcoords([event.latlng.lat, event.latlng.lng]).format(this.format)
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-panel'] = this.$load('frame/KBar')
    // Setup the actions
    this.actions = {
      default: [
        { id: 'copy-position', icon: 'las la-copy', tooltip: this.$t('KPositionIndicator.COPY'), handler: this.onCopy },
        { id: 'clear-position', icon: 'cancel', tooltip: this.$t('KPositionIndicator.CLEAR'), handler: this.onClear }
      ]
    }
  },
  mounted () {
    this.onClear()
  },
  beforeDestroy () {
    this.stop()
  }
}
</script>
