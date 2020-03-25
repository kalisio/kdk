<template>

  <div class="k-timecontroller-container"
       @click="onTimelineClick" @mousemove="onTimelineMouseMove" @mouseout="onTimelineMouseOut">

    <q-resize-observer @resize="onResize" />

    <div v-bind:style="pointerContainerStyle">
      <k-timeline-pointer
        :position="position"
        :time="currentValue"
        :formatter="timeFormatter"
        :componentLeft="componentLeft"
        :componentWidth="componentWidth"
        :pointerColor="pointerColor"
        :pointerTextColor="pointerTextColor"
        @change="onChangePosition"
        @changePointer="onChangePointer" />
      <k-timeline-indicator
        :position="timeIndicatorPosition"
        :time="timeIndicatorValue"
        :visible="timeIndicatorIsVisible"
        :formatter="timeFormatter"
        :componentLeft="componentLeft"
        :componentWidth="componentWidth"
        :color="color"
        :textColor="pointerTextColor"
        :timePointerLeft="timePointerLeft"
        :timePointerRight="timePointerRight"
        :timePointerHeight="timePointerHeight" />
    </div>

    <div class="k-timecontroller-currenttime" v-bind:style="currentTimeStyle"></div>
    <div class="k-timecontroller-activebar" v-bind:style="activeBarStyle"></div>
    <div class="k-timecontroller-bar" v-bind:style="barStyle" ref="timeControllerBar"></div>

    <div v-bind:style="tickContainerStyle" class="k-interval-ticks-container">
      <k-timeline-interval
        v-for="interval in timeIntervals" :key="interval.value"
        :color="color"
        :interval="interval"
        :formatter="timeFormatter"
        :intervalDisplayWidth="intervalDisplayWidth"
        :labelFontSize="labelFontSize"
      />
    </div>

  </div>

</template>

<script>
import { colors } from 'quasar'
import KTimelineInterval from './KTimelineInterval'
import KTimelinePointer from './KTimelinePointer'
import KTimelineIndicator from './KTimelineIndicator'

export default {
  name: 'k-timeline-bar',
  components: {
    KTimelineInterval,
    KTimelinePointer,
    KTimelineIndicator
  },
  props: {
    min: null, // min value: time from
    max: null, // max value: time until
    step: null, // step (granularity): 'h' (hour) or 'm' (minute)
    value: null, // value: initial time
    timeInterval: null, 
    timeFormatter: null,
    lineHeight: { type: Number, default: 4 },
    color: { type: String, default: colors.getBrand('primary') },
    activeColor: { type: String, default: colors.getBrand('secondary') },
    pointerColor: { type: String, default: colors.getBrand('secondary') },
    pointerTextColor: { type: String, default: 'white' },
    labelFontSize: { type: Number, default: 12 }
  },
  data () {
    return {
      currentValue: this.value,
      previousValue: null,
      componentLeft: null,
      componentWidth: null,
      timeIndicatorPosition: null,
      timeIndicatorValue: null,
      timeIndicatorIsVisible: false,
      timeNow: null,
      timeUpdater: null,
      timePointerLeft: null,
      timePointerRight: null,
      timePointerHeight: null
    }
  },
  mounted () {
    this.updateComponentDimensions()
  },
  computed: {
    position: {
      get: function () {
        return this.calculatePosition(this.currentValue, this.min, this.max, this.componentWidth)
      },
      set: function (newPosition) {
        this.changePosition(newPosition, false)
      }
    },
    timeIntervals () {
      const intervalValues = this.calculateIntervals(this.min, this.max, this.timeInterval)
      const timeIntervals = []

      // Push the time intervals; note that the number of intervals is one less than the number of values
      for (let i = 0, len = intervalValues.length - 1; i < len; i++) {
        const value = intervalValues[i]
        const nextValue = intervalValues[i + 1]

        timeIntervals.push(
          this.getTimeInterval(value, nextValue,
            this.min, this.max, this.componentWidth,
            i === 0, i === len - 1
          )
        )
      }
      return timeIntervals
    },
    barStyle () {
      return {
        height: this.barHeight(),
        width: '100%',
        backgroundColor: this.color,
        borderRadius: '2px'
      }
    },
    activeBarStyle () {
      const activeBarWidth = this.activeBarWidth()

      return {
        height: this.barHeight(),
        width: activeBarWidth,
        backgroundColor: this.activeColor,
        borderRadius: activeBarWidth === '100%' ? '2px' : '2px 0 0 2px'
      }
    },
    currentTimeStyle () {
      const timeNowPosition = this.calculatePosition(this.timeNow, this.min, this.max, this.componentWidth)

      return {
        marginLeft: timeNowPosition + 'px',
        height: this.barHeight(),
        width: '6px',
        backgroundColor: this.pointerTextColor
      }
    },
    tickContainerStyle () {
      return {
        height: '5px', // TODO make configurable
        top: this.barHeight()
      }
    },
    pointerContainerStyle () {
      return {
        height: '9px', // TODO make configurable
        bottom: 0
      }
    },
    intervalDisplayWidth () {
      return this.componentWidth * this.timeInterval.length / (this.max - this.min)
    }
  },
  methods: {
    changePosition (newPosition, final) {
      this.currentValue = this.calculateValue(newPosition, this.min, this.max, this.componentWidth)

      if (final || this.valueChanged(this.currentValue, this.previousValue, this.step, this.timeInterval)) {
        this.previousValue = this.currentValue

        this.$emit('change', { value: this.currentValue, final })
      }
    },
    calculatePosition (value, rangeStart, rangeEnd, componentWidth) {
      return Math.round(componentWidth * (value - rangeStart) / (rangeEnd - rangeStart))
    },
    calculateValue (position, rangeStart, rangeEnd, componentWidth) {
      return Math.round(rangeStart + position / componentWidth * (rangeEnd - rangeStart))
    },
    calculateIntervals (rangeStart, rangeEnd, timeInterval) {
      const intervals = []
      let value = timeInterval.getIntervalStartValue(rangeStart)

      while (value <= rangeEnd + timeInterval.length) {
        intervals.push(value)
        value += timeInterval.length
      }

      return intervals
    },
    getTimeInterval (value, nextValue, rangeStart, rangeEnd, componentWidth, isFirstValue, isLastValue) {
      return {
        value,
        nextValue,
        position: this.calculatePosition(value, rangeStart, rangeEnd, componentWidth),
        nextPosition: this.calculatePosition(nextValue, rangeStart, rangeEnd, componentWidth),
        isFirstValue,
        isLastValue,
        displayFirstTick: value > rangeStart,
        displayNextTick: isLastValue && nextValue < rangeEnd
      }
    },
    valueChanged (value, previousValue, step, timeInterval) {
      return timeInterval.valueChanged(value, previousValue, step)
    },
    barHeight () {
      return this.lineHeight + 'px'
    },
    activeBarWidth () {
      return this.position + 'px'
    },
    updateComponentDimensions () {
      const componentRef = this.$refs.timeControllerBar

      if (componentRef) {
        const componentRect = componentRef.getBoundingClientRect()

        this.componentLeft = componentRect.x
        this.componentWidth = componentRect.width
      }
    },
    onResize (size) {
      this.updateComponentDimensions()
    },
    onChangePosition (event) {
      this.changePosition(event.value, event.final)
    },
    onChangePointer (rect) {
      this.timePointerLeft = rect.x
      this.timePointerRight = rect.x + rect.width
      this.timePointerHeight = rect.height
    },
    onTimelineClick (event) {
      let newPosition = event.clientX - this.componentLeft

      // Don't allow a position out of bounds
      if (newPosition < 0) {
        newPosition = 0
      } else if (newPosition > this.componentWidth) {
        newPosition = this.componentWidth
      }

      this.onChangePosition({ value: newPosition, final: true })
    },
    onTimelineMouseOut (event) {
      this.timeIndicatorIsVisible = false
    },
    onTimelineMouseMove (event) {
      const newPosition = event.clientX - this.componentLeft

      this.timeIndicatorIsVisible = true
      this.timeIndicatorPosition = newPosition
      this.timeIndicatorValue = this.calculateValue(newPosition, this.min, this.max, this.componentWidth)
    }
  }
}
</script>

<style>
  .k-timecontroller-container {
    width: 100%;
    background-color: transparent;
    position: relative;
    cursor: pointer;
  }

  .k-timecontroller-activebar, .k-timecontroller-bar, .k-timecontroller-currenttime {
    position: absolute;
    top: 0;
  }

  .k-timecontroller-activebar {
    z-index: 100;
  }

  .k-timecontroller-currenttime {
    z-index: 200;
  }

  .k-interval-ticks-container, .k-interval-pointer-container {
    position: absolute;
    width: 100%;
    overflow: visible;
  }
</style>
