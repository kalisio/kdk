<template>
  <k-card v-bind="$props" :itemActions="actions" :options="{ nameField: 'model' }">
    <!--
      Card icon
     -->
    <q-icon slot="card-icon" :name="platformIcon" />
    <!--
      Card content
     -->
    <div slot="card-content">
      {{platform}} {{item.version}} - {{manufacturer}}<br />
      {{$t('KDeviceCard.SERIAL_NUMBER')}}: {{item.serial}}<br /><br />
      <cite v-if="lastActivity">{{$t('KDeviceCard.LAST_ACTIVITY')}} {{lastActivity.toLocaleString()}}</cite>
    </div>
  </k-card>
</template>

<script>
import _ from 'lodash'
import { Dialog } from 'quasar'
import mixins from '../../mixins'

export default {
  name: 'k-device-card',
  mixins: [
    mixins.baseItem
  ],
  computed: {
    platformIcon () {
      const platform = this.item.platform.toLowerCase()
      return (platform.includes('windows') ? 'fa-windows'
        : (platform.includes('android') ? 'fa-android'
          : (platform.includes('ios') ? 'fa-apple' : 'fa-mobile-alt')))
    },
    platform () {
      return _.capitalize(this.item.platform.toLowerCase())
    },
    manufacturer () {
      return _.capitalize(this.item.manufacturer.toLowerCase())
    },
    lastActivity () {
      return this.item.lastActivity ? new Date(this.item.lastActivity) : null
    }
  },
  data () {
    return {
    }
  },
  methods: {
    refreshActions () {
      this.clearActions()
      if (this.$can('remove', 'devices', this.contextId, this.item)) {
        this.registerPaneAction({
          name: 'remove-device',
          label: this.$t('KDeviceCard.UNLINK_LABEL'),
          icon: 'phonelink_erase',
          handler: this.removeDevice
        })
      }
    },
    removeDevice (device) {
      const description = device.platform + ' ' + device.manufacturer + ' ' + device.model
      Dialog.create({
        title: this.$t('KDeviceCard.UNLINK_DIALOG_TITLE', { description }),
        message: this.$t('KDeviceCard.UNLINK_DIALOG_MESSAGE', { description }),
        html: true,
        ok: {
          label: this.$t('OK'),
          flat: true
        },
        cancel: {
          label: this.$t('CANCEL'),
          flat: true
        }
      }).onOk(() => {
        const devicesService = this.$api.getService('devices')
        devicesService.remove(device.registrationId)
      })
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-card'] = this.$load('collection/KCard')
  }
}
</script>
