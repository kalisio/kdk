<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <div v-html="text" />
  </div>
  <div v-else :class="labelClass">
    <q-select
      v-model="resolution"
      :options="getResolutions()"
      style="min-width: 30%"
      dense
      :borderless="borderless"
      :disable="disabled"
      @update:model-value='updateModel()'
    >
      <template v-slot:option="scope">
        <q-item v-bind="scope.itemProps">
          <q-item-section>
            <q-item-label v-html="scope.opt.label" />
          </q-item-section>
          <q-item-section side>
            <q-item-label caption>{{ scope.opt.description }}</q-item-label>
          </q-item-section>
        </q-item>
      </template>
    </q-select>
    <q-input
      v-model.number="width"
      type="number"
      min="256" max="4000"
      mask="(#)###"
      dense
      :borderless="borderless"
      input-class="text-center"
      style="max-width: 54px"
      :disable="disabled"
      @update:model-value='updateModel(width)'
    />
    <span>x</span>
    <q-input
      v-model.number="height"
      type="number"
      min="256" max="4000"
      mask="(#)###"
      dense
      :borderless="borderless"
      input-class="text-center"
      style="max-width: 54px"
      :disable="disabled"
      @update:model-value='updateModel(height)'
    />
  </div>
</template>

<script>
import _ from 'lodash'
import { baseField } from '../../mixins'
import { i18n } from '../../i18n.js'

export default {
  mixins: [baseField],
  data () {
    return {
      width: 1280,
      height: 720,
      resolution: undefined
    }
  },
  watch: {
    resolution: {
      immediate: true,
      handler (value) {
        if (!value) this.resolution = this.getResolutions()[1]
        else {
          const size = _.split(this.resolution.value, 'x')
          this.width = size[0]
          this.height = size[1]
        }
        this.updateModel()
      }
    },
    width: {
      handler (value) {
        if (value < 256) this.width = 256
        if (value > 4000) this.width = 4000
        this.updateModel()
      }
    },
    height: {
      handler (value) {
        if (value < 256) this.height = 256
        if (value > 4000) this.height = 4000
        this.updateModel()
      }
    }
  },
  computed: {
    labelClass () {
      const classObject = {}
      classObject['row items-center no-wrap q-gutter-x-xs q-pb-md'] = true
      if (this.properties.center) classObject['justify-center'] = true
      return classObject
    },
    borderless () {
      return this.properties.borderless ? this.properties.borderless : false
    }
  },
  methods: {
    getResolutions () {
      return [
        { label: i18n.t('KResolutionField.SD_LABEL'), description: i18n.t('KResolutionField.SD_DESCRIPTION'), value: '640x480' },
        { label: i18n.t('KResolutionField.HD_LABEL'), description: i18n.t('KResolutionField.HD_DESCRIPTION'), value: '1280x720' },
        { label: i18n.t('KResolutionField.FHD_LABEL'), description: i18n.t('KResolutionField.FHD_DESCRIPTION'), value: '1920x1080' },
        { label: i18n.t('KResolutionField.QHD_LABEL'), description: i18n.t('KResolutionField.QHD_DESCRIPTION'), value: '2560x1440' },
        { label: i18n.t('KResolutionField.2K_LABEL'), description: i18n.t('KResolutionField.2K_DESCRIPTION'), value: '2048x1080' },
        { label: i18n.t('KResolutionField.4K_LABEL'), description: i18n.t('KResolutionField.4K_DESCRIPTION'), value: '3840x2160' }
      ]
    },
    updateModel () {
      this.model = { width: this.width, height: this.height }
    }
  }
}
</script>
