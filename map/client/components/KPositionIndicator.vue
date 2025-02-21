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
import { Notify, copyToClipboard } from 'quasar'
import { Layout, i18n, utils as kdkCoreUtils } from '../../../core.client'
import { formatUserCoordinates } from '../utils'
import KAction from '../../../core/client/components/action/KAction.vue'

export default {
  components: {
    KAction
  },
  inject: ['kActivity'],
  props: {
    size: {
      type: Number,
      default: 48
    }
  },
  data () {
    return {
      position: (this.kActivity.is2D() ? this.kActivity.getCenter() : this.kActivity.getCameraEllipsoidTarget())
    }
  },
  computed: {
    formattedPosition () {
      if (_.isNil(this.position)) return i18n.t('KPositionIndicator.OUTSIDE_MAP')
      return formatUserCoordinates(this.position.latitude, this.position.longitude, this.$store.get('locationFormat', 'FFf'))
    }
  },
  methods: {
    updatePosition (event) {
      this.position = (this.kActivity.is2D() ? this.kActivity.getCenter() : this.kActivity.getCameraEllipsoidTarget())
    },
    async onCopy () {
      try {
        await copyToClipboard(this.formattedPosition)
        Notify.create({ type: 'positive', message: i18n.t('KPositionIndicator.POSITION_COPIED') })
      } catch (error) {
        Notify.create({ type: 'negative', message: i18n.t('KPositionIndicator.CANNOT_COPY_POSITION') })
      }
    }
  },
  async mounted () {
    // Update page content with target
    const target = {
      id: 'position-target',
      component: 'QImg',
      src: 'kdk/target.svg',
      height: `${this.size}px`,
      width: `${this.size}px`,
      position: 'center',
      offset: [0, -this.size / 2],
      style: 'pointer-events: none; background-color: #00000020; border-radius: 50%;'
    }
    kdkCoreUtils.bindContent(target, this.kActivity)
    const stickies = Layout.getStickies().components
    // Required to use splice when modifying an object inside an array to make it reactive
    stickies.splice(stickies.length, 0, target)
    this.kActivity.$engineEvents.on('movestart', this.updatePosition)
    this.kActivity.$engineEvents.on('move', this.updatePosition)
    this.kActivity.$engineEvents.on('moveend', this.updatePosition)
  },
  beforeUnmount () {
    const stickies = Layout.getStickies().components
    // Required to use splice when modifying an object inside an array to make it reactive
    stickies.splice(_.findIndex(stickies, component => component.id === 'position-target'), 1)
    this.kActivity.$engineEvents.off('movestart', this.updatePosition)
    this.kActivity.$engineEvents.off('move', this.updatePosition)
    this.kActivity.$engineEvents.off('moveend', this.updatePosition)
  }
}
</script>
