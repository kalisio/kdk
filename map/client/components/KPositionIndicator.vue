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
import { Layout, utils as kdkCoreUtils } from '../../../core.client'
import { formatUserCoordinates } from '../utils'
import KAction from '../../../core/client/components/action/KAction.vue'

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
        this.$notify({ type: 'negative', message: this.$t('KPositionIndicator.CANNOT_COPY_POSITION') })
      }
    }
  },
  async mounted () {
    // Update page content with target
    const target = {
      id: 'position-target',
      component: 'QImg',
      src: 'icons/kdk/target.svg',
      height: this.size,
      width: this.size,
      class: 'fixed-center k-position-indicator'
    }
    kdkCoreUtils.bindContent(target, this.kActivity)
    const components = Layout.getPage().components
    // Required to use splice when modifying an object inside an array to make it reactive
    components.splice(components.length, 0, target)
    this.kActivity.$engineEvents.on('move', this.updatePosition)
  },
  beforeUnmount () {
    const components = Layout.getPage().components
    // Required to use splice when modifying an object inside an array to make it reactive
    components.splice(_.findIndex(components, component => component.id === 'position-target'), 1)
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
