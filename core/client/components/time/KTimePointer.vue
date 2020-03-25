<template>
  <div class="k-interval-pointer"
        ref="timePointer"
        v-bind:style="pointerStyle"
        @mousedown="startDrag"
        v-touch-pan.nomouse.horizontal="doPan"
  >
    {{pointerLabel}}
  </div>
</template>

<script>
import { TouchPan } from 'quasar'

export default {
  name: 'k-time-pointer',
  directives: {
    TouchPan
  },
  props: [
    'position',
    'time',
    'componentLeft',
    'componentWidth',
    'formatter',
    'pointerColor',
    'pointerTextColor'
  ],
  data () {
    return {
      // Dragging of the pointer
      dragging: false
    }
  },
  mounted () {
    window.addEventListener('mouseup', this.stopDrag)
    window.addEventListener('mousemove', this.doDrag)
  },
  updated () {
    // initial change-pointer event
    this.emitChangePointer()
  },
  beforeDestroy () {
    window.removeEventListener('mouseup', this.stopDrag)
    window.removeEventListener('mousemove', this.doDrag)
  },
  computed: {
    pointerStyle () {
      return {
        // Put the "tip" of the pointer's downward pointing arrow at the right place. We need an offset
        // of 25px, this is the distance of the downward "arrow" from the left side of the label box.
        left: this.position - 25 + 'px',
        color: this.pointerTextColor,
        backgroundColor: this.pointerColor,
        // Set a CSS var that gets used in the ::after pseudo-element,
        // see: https://forum.vuejs.org/t/style-binding-on-pseudo-selector/5544/7
        '--pointerColor': this.pointerColor
      }
    },
    pointerLabel () {
      return this.formatter.format(this.time, 'pointer')
    }
  },
  methods: {
    // Dragging of the pointer
    startDrag () {
      this.dragging = true
    },
    stopDrag (event) {
      if (this.dragging) {
        this.doMove(event.clientX, true)
      }
      this.dragging = false
    },
    doDrag (event) {
      if (this.dragging) {
        this.doMove(event.clientX, false)
      }
    },
    doPan (obj) {
      this.doMove(obj.position.left, obj.isFinal)
    },
    doMove (targetPosition, final) {
      let newPosition = targetPosition - this.componentLeft

      // Don't allow a position out of bounds
      if (newPosition < 0) {
        newPosition = 0
      } else if (newPosition > this.componentWidth) {
        newPosition = this.componentWidth
      }

      this.$emit('change', { value: newPosition, final })
      this.emitChangePointer()
    },
    emitChangePointer () {
      const componentRef = this.$refs.timePointer

      if (componentRef) {
        this.$emit('changePointer', componentRef.getBoundingClientRect())
      }
    }
  }
}
</script>

<style>
  .k-interval-pointer {
    position: absolute;
    bottom: 15px;
    border-radius: 5px;
    font-size: 12px;
    padding-bottom: 6px;
    padding-top: 3px;
    padding-left: 8px;
    padding-right: 8px;
    cursor: grab;
    height: 24px;
    white-space: nowrap;
    user-select: none;
    z-index: 300;
  }

  .k-interval-pointer::after {
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
