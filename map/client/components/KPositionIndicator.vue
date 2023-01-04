<template>
  <div>
    <div id="position-indicator" class="row items-center no-padding">
      <span class="q-pl-md q-pr-md">
        {{ formattedPosition }}
      </span>
      <k-action
        id="copy-position"
        icon="las la-copy"
        tooltip="KPositionIndicator.COPY"
        :handler="onCopy"
      />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { copyToClipboard } from 'quasar'
import { Layout } from '../../../core/client/layout'
import { formatUserCoordinates } from '../utils'
import KAction from '../../../core/client/components/KAction.vue'

export default {
  components: {
    KAction
  },
  inject: ['kActivity'],
  props: {
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
        this.$notify({ type: 'positive', message: this.$t('KPositionIndicator.POSITION_COPIED') })
      } catch (error) {
        this.$notify({ message: this.$t('KPositionIndicator.CANNOT_COPY_POSITION') })
      }
    }
  },
  async mounted () {
    // Update page content with target
    const target = {
      component: 'QImg', src: 'icons/kdk/target.svg', height: this.size, width: this.size, class: 'fixed-center k-position-indicator'
    }
    Layout.bindContent(target, this.kActivity)
    const content = this.$store.get('page.content') || []
    // Required to use splice when modifying an object inside an array to make it reactive
    content.splice(content.length, 0, target)
    this.$store.patch('page', { content })
    this.kActivity.$engineEvents.on('move', this.updatePosition)
  },
  beforeUnmount () {
    const content = this.$store.get('page.content') || []
    // Required to use splice when modifying an object inside an array to make it reactive
    if (content) {
      content.splice(_.findIndex(content, component => component.id === 'position-target'), 1)
      this.$store.patch('page', { content })
    }
    this.kActivity.$engineEvents.off('move', this.updatePosition)
  }
}
</script>

<style lang="scss">
  .k-position-indicator {
    pointer-events: none;
    border-radius: 50%;
    background-color: #00000020;
    z-index: $sticky-z-index;
  }
</style>
