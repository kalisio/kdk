<template>
  <div>
    <div v-if="interval.displayFirstTick" class="k-interval-tick" v-bind:style="firstTickStyle">
    </div>
    <div class="k-interval-label" v-bind:style="labelStyle">
      {{intervalLabel}}
    </div>
    <div v-if="interval.displayNextTick" class="k-interval-tick" v-bind:style="nextTickStyle">
    </div>
  </div>
</template>

<script>
export default {
  name: 'k-time-interval',
  components: {
  },
  props: [
    'interval',
    'formatter',
    'intervalDisplayWidth',
    'color',
    'labelFontSize'
  ],
  data () {
    return {
    }
  },
  computed: {
    firstTickStyle () {
      return {
        left: this.interval.position + 'px',
        backgroundColor: this.color
      }
    },
    nextTickStyle () {
      return {
        left: this.interval.nextPosition + 'px',
        backgroundColor: this.color
      }
    },
    labelStyle () {
      return {
        left: this.interval.position + 'px',
        width: this.intervalDisplayWidth + 'px',
        color: this.color,
        fontSize: this.labelFontSize + 'px'
      }
    },
    intervalLabel () {
      return this.formatter.format(this.interval.value, 'interval', { width: this.intervalDisplayWidth })
    }
  },
  methods: {
  }
}
</script>

<style>
  .k-interval-tick {
    position: absolute;
    top: 0;
    width: 1px;
    height: 100%;
    opacity: 0.8;
  }

  .k-interval-label {
    position: absolute;
    transform: translate(-20px, 6px);
    height: 100%;
    text-align: center;
    opacity: 0.8;
  }
</style>
