<template>
  <KCard v-bind="$props" :actions="itemActions" :bind-actions="false"
    :options="{ nameField: 'model' }" :header="header" :dense="dense">
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
  </KCard>
</template>

<script>
import _ from 'lodash'
import { Dialog } from 'quasar'
import { baseItem } from '../../mixins'
import KCard from '../collection/KCard'

export default {
  components: {
    KCard
  },
  mixins: [baseItem],
  computed: {
    platformIcon () {
      const platform = this.item.platform.toLowerCase()
      return (platform.includes('windows')
        ? 'fa-windows'
        : (platform.includes('android')
            ? 'fa-android'
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
    removeDevice (context) {
      const description = context.item.platform + ' ' + context.item.manufacturer + ' ' + context.item.model
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
        devicesService.remove(context.item.registrationId)
      })
    }
  }
}
</script>
