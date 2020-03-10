<template>
  <div v-if="isVisible" class="k-level-slider">
    <vue-slider class="text-primary"
      v-model="kActivity.selectedLevel"
      :direction="'btt'"
      :height="150"
      :width="4"
      :lazy="isLazy"
      :marks="true"
      :hide-label="true"
      :data="sliderValues"
      :min="sliderMinValue"
      :max="sliderMaxValue"
      :interval="sliderInterval"
      :tooltip="'focus'"
      :tooltip-formatter="getFormatedLevel"
      @change="onLevelChanged"
    />
    <p class="text-secondary text-caption" style="writing-mode: vertical-lr; transform-origin: 100% 0%; transform: rotate(180deg);">
      <b>{{$t(kActivity.selectableLevels.label)}} - {{getFormatedLevel(kActivity.selectedLevel)}}</b>
    </p>
  </div>
</template>

<script>
import _ from 'lodash'
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/material.css'

export default {
  name: 'k-level-slider',
  inject: ['kActivity'],
  components: {
    VueSlider
  },
  computed: {
    isVisible () {
      if (this.sliderValues) { return this.sliderValues.length > 0 }
      return this.sliderMinValue !== undefined && this.sliderMaxValue !== undefined
    },
    isLazy () {
      // lazy by default
      return _.get(this.kActivity.selectableLevels, 'lazy', true)
    },
    sliderValues () {
      return _.get(this.kActivity.selectableLevels, 'values')
    },
    sliderMinValue () {
      return _.get(this.kActivity.selectableLevels, 'range.min')
    },
    sliderMaxValue () {
      return _.get(this.kActivity.selectableLevels, 'range.max')
    },
    sliderInterval () {
      return _.get(this.kActivity.selectableLevels, 'range.interval', 1)
    }
  },
  methods: {
    onLevelChanged (level) {
      this.kActivity.setSelectedLevel(level)
    },
    getFormatedLevel (level) {
      const unit = _.get(this.kActivity.selectableLevels, 'units[0]')
      return `${level || this.kActivity.selectedLevel} ${unit}`
    }
  }
}
</script>

<style lang="stylus">
.vue-slider-rail
  background-color: $secondary;

.vue-slider-disabled .vue-slider-rail
  background-color: $secondary;

.vue-slider-process
  background-color: $secondary;

.vue-slider-dot-handle
  background-color: $secondary;

.vue-slider-dot-handle::after
  background-color: transparentify($secondary, #000);

.vue-slider-dot-tooltip-inner
  background-color: transparentify($secondary, #000);

.vue-slider-dot-tooltip-text
  width: 60px;
  height: 60px;
  font-size: 1em;

.vue-slider-mark-step
  background-color: $primary;

.vue-slider-mark-step-active
  background-color: $primary;
</style>
