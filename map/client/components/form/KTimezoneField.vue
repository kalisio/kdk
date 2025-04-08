<template>
  <div>
    <div v-if="readOnly" :id="properties.name + '-field'">
      {{ model }}
    </div>
    <div v-else>
      <q-select
        :for="properties.name + '-field'"
        :id="properties.name + '-field'"
        v-model="model"
        :label="label"
        :options="options"
        use-input
        hide-dropdown-icon
        @update:model-value='onChanged'
        @filter="onAutocomplete"
        emit-value
        map-options
        :error="hasError"
        :error-message="errorLabel"
        :disable="disabled"
        bottom-slots
      >
        <!-- Options display -->
        <template v-slot:option="scope">
          <q-item
            v-bind="scope.itemProps"
            :id="scope.opt.value"
          >
            <q-item-section>
              <q-item-label>{{ scope.opt.label }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
        <template v-slot:append>
          <!-- Map display -->
          <KAction
            id="timezone-map"
            icon="las la-map-marker"
            color="primary"
            :handler="openTimezoneMap"
            :tooltip="$t('KTimezoneField.TIMEZONE_MAP_TOOLTIP')"
            :propagate="false"
          />
        </template>
        <!-- Helper -->
        <template v-if="hasHelper" v-slot:append>
          <k-action
            :id="properties.name + '-helper'"
            :label="helperLabel"
            :icon="helperIcon"
            :tooltip="helperTooltip"
            :url="helperUrl"
            :dialog="helperDialog"
            :context="helperContext"
            @dialog-confirmed="onHelperDialogConfirmed"
            color="primary"
          />
        </template>
      </q-select>
      <k-modal ref="timezoneMapModal"
        :title="$t('KTimezoneField.TIMEZONE_MAP_TITLE')"
        :buttons="getTimezoneMapModalButtons()"
        :options="{}">
        <k-timezone-map
          id="timezones-map"
          style="min-height: 250px;"
          :value="this.model"
          @timezone-selected="onMapTimezoneSelected"
        />
      </k-modal>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment-timezone/builds/moment-timezone-with-data-10-year-range'
import { mixins as kCoreMixins, utils as kCoreUtils } from '../../../../core/client'
import { KAction, KModal } from '../../../../core/client/components'
import KTimezoneMap from '../KTimezoneMap.vue'
import meta from 'moment-timezone/data/meta/latest.json'

const timezones = moment.tz.names()
// Timezone names contains additional "usual" timezone namings like GMT+1, etc.
// const timezones = _.keys(meta.zones)
const countries = _.values(meta.countries)

export default {
  name: 'k-timezone-field',
  components: {
    KAction,
    KModal,
    KTimezoneMap
  },
  mixins: [kCoreMixins.baseField],
  data () {
    return {
      options: timezones.map(timezone => ({ value: timezone, label: kCoreUtils.getTimezoneLabel(timezone) }))
    }
  },
  methods: {
    getTimezoneMapModalButtons () {
      return [
        { id: 'cancel-button', label: 'CANCEL', renderer: 'form-button', outline: true, handler: () => this.closeTimezoneMap() },
        { id: 'apply-button', label: 'APPLY', renderer: 'form-button', handler: () => this.closeTimezoneMap(true) }
      ]
    },
    onMapTimezoneSelected (timezone) {
      this.mapTimezone = timezone
    },
    openTimezoneMap () {
      this.$refs.timezoneMapModal.open()
    },
    async closeTimezoneMap (fill = false) {
      this.$refs.timezoneMapModal.close()
      if (fill) {
        this.fill(this.mapTimezone)
        // Seems to be required to correctly update the label in the q-select
        await this.$nextTick()
      }
    },
    onAutocomplete (value, update) {
      // Check for any matching country also
      const matchingCountries = countries.filter(country => country.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()))
      update(() => {
        this.options = timezones
          .filter(timezone => {
            // Filter applies to timezone names or country names
            const matchTimezone = timezone.toLocaleLowerCase().includes(value.toLocaleLowerCase())
            if (matchTimezone) return true
            // We have the list of timezones associated to each matching country
            for (let i = 0; i < matchingCountries.length; i++) {
              const matchingTimezones = matchingCountries[i].zones
              if (matchingTimezones.includes(timezone)) return true
            }
            return false
          })
          .map(timezone => ({ value: timezone, label: kCoreUtils.getTimezoneLabel(timezone) }))
      })
    }
  },
  created () {
    // Load metadata
    this.meta = require('moment-timezone/data/meta/latest.json')
  }
}
</script>
