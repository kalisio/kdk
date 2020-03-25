<template>
  <div class="k-time-pointer"
        ref="timeIndicator"
        v-bind:style="pointerStyle"
  >
    {{pointerLabel}}
  </div>
</template>

<script>
export default {
  name: 'k-time-indicator',
  components: {
  },
  props: [
    'position',
    'time',
    'visible',
    'componentLeft',
    'componentWidth',
    'formatter',
    'color',
    'textColor',
    'timePointerLeft',
    'timePointerRight',
    'timePointerHeight'
  ],
  data () {
    return {
    }
  },
  computed: {
    pointerStyle () {
      return {
        // Put the "tip" of the pointer's downward pointing arrow at the right place. We need an offset
        // of 25px, this is the distance of the downward "arrow" from the left side of the label box.
        left: this.position - 25 + 'px',
        bottom: this.calculateBottom(this.timePointerLeft, this.timePointerRight, this.timePointerHeight) + 'px',
        color: this.textColor,
        visibility: this.visible ? 'visible' : 'hidden',
        backgroundColor: this.color,
        // Set a CSS var that gets used in the ::after pseudo-element,
        // see: https://forum.vuejs.org/t/style-binding-on-pseudo-selector/5544/7
        '--pointerColor': this.color
      }
    },
    pointerLabel () {
      return this.formatter.format(this.time, 'indicator')
    }
  },
  methods: {
    calculateBottom (timePointerLeft, timePointerRight, timePointerHeight) {
      let bottom = 19 // default 19px

      if (this.timeIndicatorOverlapsTimePointer(this.$refs.timeIndicator, timePointerLeft, timePointerRight)) {
        bottom += timePointerHeight
      }

      return bottom
    },
    timeIndicatorOverlapsTimePointer (timeIndicatorRef, timePointerLeft, timePointerRight) {
      // If the time indicator ref or the time pointer rect are not defined (yet): return overlaps = false
      if (!timeIndicatorRef || !timePointerLeft) {
        return false
      }

      const timeIndicatorRect = timeIndicatorRef.getBoundingClientRect()

      // If the left side of the time indicator is "within" the time pointer: return overlaps = true
      if (
        timeIndicatorRect.x < timePointerRight &&
            timeIndicatorRect.x > timePointerLeft
      ) {
        return true
      }

      // If the right side of the time indicator is "within" the time pointer: return overlaps = true
      if (
        timeIndicatorRect.x + timeIndicatorRect.width > timePointerLeft &&
            timeIndicatorRect.x + timeIndicatorRect.width < timePointerRight
      ) {
        return true
      }

      // If the time indicator is completely "outside" the time pointer: return overlaps = false
      return false
    }
  }
}
</script>

<style>
  .k-time-pointer {
    position: absolute;
    border-radius: 5px;
    font-size: 12px;
    padding-bottom: 6px;
    padding-top: 6px;
    padding-left: 8px;
    padding-right: 8px;
    cursor: pointer;
    height: 26px;
    white-space: nowrap;
    user-select: none;
    z-index: 200;
  }

  .k-time-pointer::after {
    position: absolute;
    top: 100%;
    left: 25px;
    height: 0;
    width: 0;
    margin-left: -0.5em;
    content: ' ';
    border: solid transparent;
    border-top-color: var(--pointerColor);
    border-top-style: solid;
    border-top-width: 0.5em;
    border-right-color: transparent;
    border-right-style: solid;
    border-right-width: 0.5em;
    border-bottom-color: transparent;
    border-bottom-style: solid;
    border-bottom-width: 0.5em;
    border-left-color: transparent;
    border-left-style: solid;
    border-left-width: 0.5em;
    border-image-source: initial;
    border-image-slice: initial;
    border-image-width: initial;
    border-image-outset: initial;
    border-image-repeat: initial;
    border-width: .5em;
    border-top-width: 0.5em;
    border-right-width: 0.5em;
    border-bottom-width: 0.5em;
    border-left-width: 0.5em;
    border-top-width: 0.5em;
    border-right-width: 0.5em;
    border-bottom-width: 0.5em;
    border-left-width: 0.5em;
  }
</style>
