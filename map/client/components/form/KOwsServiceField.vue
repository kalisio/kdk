<template>
  <div>
    <q-select
      :for="properties.name + '-field'"
      :id="properties.name + '-field'"
      ref="select"
      v-model="request"
      :label="label"
      fill-input
      autocomplete="off"
      hide-selected
      clearable
      emit-value
      use-input
      new-value-mode="add-unique"
      :error-message="errorLabel"
      :error="hasError"
      bottom-slots
      :options="availableServices"
      option-label="name"
      option-value="request"
      :loading="loading"
      @clear="onCleared"
      @update:model-value="onUpdated">
      <template v-slot:append>
        <k-action v-if="canAddService" id="add-service" icon="add_circle" color="grey-7" :handler="onAddService" />
      </template>
      <!-- Options -->
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section avatar>
            <q-badge dense>{{ scope.opt.protocol }}</q-badge>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ scope.opt.baseUrl }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <k-action id="delete-service" icon="las la-trash" :propagate="false" @triggered="onDeleteService(scope.opt)" />
          </q-item-section>
        </q-item>
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
    <!-- Header -->
    <div class="row" v-if="showHeader">
      <q-input class="col"
        :for="properties.name + '-header-key-field'"
        :id="properties.name + '-header-key-field'"
        type="text"
        v-model="headerKey"
        :label="$t('KOwsServiceField.HEADER_KEY')"
        :input-class="inputClass"
        clearable
      />
      <q-input class="col"
        :for="properties.name + '-header-value-field'"
        :id="properties.name + '-header-value-field'"
        type="text"
        v-model="headerValue"
        :label="$t('KOwsServiceField.HEADER_VALUE')"
        :input-class="inputClass"
        clearable
      />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import xml2js from 'xml2js'
import { mixins as kCoreMixins } from '../../../../core/client'
import { KAction } from '../../../../core/client/components'
import * as wms from '../../../common/wms-utils'
import * as wfs from '../../../common/wfs-utils'
import * as wmts from '../../../common/wmts-utils'
import * as tms from '../../../common/tms-utils'

export default {
  name: 'k-ows-service-field',
  components: {
    KAction
  },
  mixins: [kCoreMixins.baseField],
  data () {
    return {
      request: '',
      availableServices: [],
      showHeader: false,
      headerKey: '',
      headerValue: '',
      loading: false
    }
  },
  computed: {
    canAddService () {
      if (!this.model) return false
      return !_.find(this.availableServices, { request: this.model.request })
    },
    inputClass () {
      return _.get(this.properties, 'field.inputClass', 'text-weight-regular')
    }
  },
  methods: {
    emptyModel () {
      return null
    },
    onCleared () {
      this.error = ''
      this.request = ''
      this.model = null
    },
    async onUpdated (request) {
      let response = null
      this.loading = true
      if (request) {
        try {
          // Check if related to registered service in cas we need headers
          const service = _.find(this.availableServices, { request })
          const url = new URL(request)
          response = await this.probeEndpoint(url, _.get(service, 'headers', {}))
          if (response) {
            // make sure WFS server supports GeoJSON output
            if (response.protocol === 'WFS' && !response.geoJsonOutputFormat) {
              this.error = 'KOwsServiceField.WFS_MISSING_GEOJSON_SUPPORT'
            } else {
              this.model = response
              this.error = ''
            }
          }
        } catch (error) {
          this.error = 'KOwsServiceField.INVALID_URL'
        }
      }
      this.loading = false
      if (this.model) this.onChanged()
    },
    async onAddService () {
      // Delete the available layers before saving the service
      const service = _.cloneDeep(this.model)
      delete service.availableLayers
      // Save the service
      await this.$api.getService('catalog').create(service)
      // Refresh the list of available services
      this.refreshAvailableServices()
    },
    async onDeleteService (service) {
      await this.$api.getService('catalog').remove(service._id)
      // Refresh the list of available services
      this.refreshAvailableServices()
      // Clear
      this.model = null
      this.request = ''
    },
    async probeEndpoint (url, headers = {}) {
      const result = {
        type: 'Service',
        name: undefined,
        request: undefined,
        baseUrl: undefined,
        searchParams: {},
        protocol: undefined,
        version: undefined,
        availableLayers: {}
      }
      // we expect WMS/WFS/WCS/WMTS/TMS get capabilities url here
      /* if user:pwd
       * var headers = new Headers();
       headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));
       fetch('https://host.com', {headers: headers})
       */
      try {
        let caps = null
        if (url.protocol === 'http:' || url.protocol === 'https:') {
          result.request = url.href
          result.baseUrl = `${url.protocol}//${url.host}${url.pathname}`
          result.headers = headers
          result.name = result.baseUrl
          for (const [k, v] of url.searchParams) result.searchParams[k] = v
          // fetch content and try to convert to json
          const query = url.href
          if (this.headerKey && this.headerValue) {
            Object.assign(result.headers, { [this.headerKey]: this.headerValue })
          }
          const resp = await fetch(query, { redirect: 'follow', headers: result.headers })
          if ((resp.status === 401) || (resp.status === 403)) {
            this.showHeader = true
            this.error = 'KOwsServiceField.UNAUTHORIZED_MESSAGE'
            return null
          }
          const txt = await resp.text()
          caps = await xml2js.parseStringPromise(txt, { tagNameProcessors: [xml2js.processors.stripPrefix] })
          // look for SERVICE=xxx
          const protocol = this.findQueryParameter(url.searchParams, 'SERVICE')
          if (protocol === 'WMS') result.protocol = 'WMS'
          else if (protocol === 'WMTS') result.protocol = 'WMTS'
          else if (protocol === 'WFS') result.protocol = 'WFS'
          else if (protocol === 'WCS') result.protocol = 'WCS'
          if (!result.protocol) {
            // might be REST WMTS request, or TMS
            if (caps.Capabilities) {
              result.protocol = 'WMTS'
              const lastSlash = url.pathname.lastIndexOf('/')
              result.baseUrl = `${url.protocol}//${url.host}${url.pathname.slice(0, lastSlash)}`
            } else if (caps.TileMapService) {
              result.protocol = 'TMS'
            }
          }

          // remove some known search params depending on service
          const knownSearchParams = new Set()
          if (result.protocol === 'WMS' || result.protocol === 'WFS' || result.protocol === 'WMTS') {
            knownSearchParams.add('SERVICE')
            knownSearchParams.add('REQUEST')
            knownSearchParams.add('VERSION')
          }
          if (knownSearchParams) {
            _.forEach(_.keys(result.searchParams), k => {
              if (knownSearchParams.has(k.toUpperCase())) {
                delete result.searchParams[k]
              }
            })
          }
        }

        if (result.protocol === 'WMS') {
          const decoded = await wms.discover(result.baseUrl, result.searchParams, result.headers, caps)
          result.availableLayers = decoded.availableLayers
          result.version = this.findQueryParameter(url.searchParams, 'VERSION')
          if (!result.version) result.version = decoded.version
        } else if (result.protocol === 'WFS') {
          const decoded = await wfs.discover(result.baseUrl, result.searchParams, result.headers, caps)
          result.availableLayers = decoded.availableLayers
          result.version = this.findQueryParameter(url.searchParams, 'VERSION')
          if (!result.version) result.version = decoded.version
          result.geoJsonOutputFormat = decoded.geoJsonOutputFormat
        } else if (result.protocol === 'WMTS') {
          const decoded = await wmts.discover(result.baseUrl, result.searchParams, result.headers, caps)
          result.availableLayers = decoded.availableLayers
          result.version = this.findQueryParameter(url.searchParams, 'VERSION')
          if (!result.version) result.version = decoded.version
          result.getTileUseKvpEncoding = decoded.getTileUseKvpEncoding
        // } else if (result.service === 'WCS') {
        } else if (result.protocol === 'TMS') {
          const decoded = await tms.discover(result.baseUrl, result.searchParams, result.headers, caps)
          result.availableLayers = decoded.availableLayers
          result.version = decoded.version
        }
      } catch (err) {
        this.error = 'KOwsServiceField.CANNOT_FETCH_URL'
        return null
      }
      return result
    },
    findQueryParameter (all, key) {
      const normalizedKey = key.toUpperCase()
      for (const p of all) {
        const k = p[0].toUpperCase()
        if (k === normalizedKey) return p[1].toUpperCase()
      }
      return null
    },
    async refreshAvailableServices () {
      // Retrieve the list of the available services
      const response = await this.$api.getService('catalog').find({ query: { type: 'Service' } })
      this.availableServices = response.data
    }
  },
  mounted () {
    this.refreshAvailableServices()
  }
}
</script>
