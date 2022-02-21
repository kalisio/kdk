<template>
  <div>
    <div id="position-indicator" class="row items-center no-padding">
      <span class="q-pl-md q-pr-md">
        {{ formattedPosition }}
      </span>
      <k-action id="copy-position" icon="las la-copy" tooltip="KPositionIndicator.COPY" :handler="onCopy" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { copyToClipboard } from 'quasar'
import { Layout } from '../../../core/client/layout'
import { formatUserCoordinates } from '../utils'

export default {
  name: 'k-position-indicator',
  inject: ['kActivity'],
  props: {
    color: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: '3rem'
    }
  },
  data () {
    return {
      position: this.kActivity.getCenter()
    }
  },
  computed: {
    formattedPosition () {
      return formatUserCoordinates(this.position.latitude, this.position.longitude, this.$store.get('locationFormat', 'FFf'))
    }
  },
  methods: {
    updatePosition (event) {
      this.position = this.kActivity.getCenter()
    },
    async onCopy () {
      try {
        await copyToClipboard(this.formattedPosition)
        this.$toast({ type: 'positive', message: this.$t('KPositionIndicator.POSITION_COPIED') })
      } catch (_) {
        this.$toast({ type: 'error', message: this.$t('KPositionIndicator.CANNOT_COPY_POSITION') })
      }
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-action'] = this.$load('frame/KAction')
  },
  async mounted () {
    // Update page content with target
    const target = [{
      id: 'position-target', component: 'QIcon', name: 'las la-plus', color: this.color, size: this.size, class: 'fixed-center position-indicator'
    }]
    Layout.bindContent(target, this.kActivity)
    const content = this.$store.get('page.content') || []
    // Required to use splice when modifying an object inside an array to make it reactive
    content.splice(content.length, 0, target[0])
    this.$store.patch('page', { content })
    this.kActivity.$on('move', this.updatePosition)
  },
  beforeDestroy () {
    const content = this.$store.get('page.content') || []
    // Required to use splice when modifying an object inside an array to make it reactive
    if (content) {
      content.splice(_.findIndex(content, component => component.id === 'position-target'), 1)
      this.$store.patch('page', { content })
    }
    this.kActivity.$off('move', this.updatePosition)
  }
}
</script>

<style lang="scss">
  .position-indicator {
    pointer-events: none;
    border-radius: 50%;
    background-color: #00000020;
  }
</style>
