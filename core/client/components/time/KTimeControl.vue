<template>
  <div id="timecontrols" class="row items-center nowrap">
    <KAction id="previous-step" icon="las la-step-backward" :dense="dense" tooltip="KTimeControl.PREVIOUS_STEP" :handler="onPreviousStepClicked" />
    <div v-if="!dense">
      <KAction id="previous-hour" icon="las la-angle-left" tooltip="KTimeControl.PREVIOUS_HOUR" :handler="onPreviousHourClicked"/>
      <KAction id="previous-day" icon="las la-calendar-minus" tooltip="KTimeControl.PREVIOUS_DAY" :handler="onPreviousDayClicked"/>
    </div>
    <KAction id="timecontrol-now" icon="las la-user-clock" :dense="dense" tooltip="KTimeControl.SET_NOW" :handler="onNowClicked">
      <q-badge v-if="isRealtime" floating rounded color="green">
        <q-icon name="las la-play" size="10px" color="white" />
      </q-badge>
    </KAction>
    <div class="q-px-xs">
      <div class="row items-center k-datetime-chip">
        <KDateTime id="datetime-controls" v-model="dateTime" />
      </div>
    </div>
    <div class="q-px-xs">
      <q-fab id="timecontrol-step" hide-icon vertical-actions-align="center" color="primary" :label="stepLabel" direction="up" padding="0">
        <template v-for="step in steps" :key="step.id">
          <q-fab-action
            :id="step.id"
            :color="step.color"
            :label="step.label"
            padding="0"
            @click="onStepClicked(step.label)"
          />
        </template>
      </q-fab>
    </div>
    <div v-if="!dense">
      <KAction id="next-day" icon="las la-calendar-plus" tooltip="KTimeControl.NEXT_DAY" :handler="onNextDayClicked"/>
      <KAction id="next-hour" icon="las la-angle-right" tooltip="KTimeControl.NEXT_HOUR" :handler="onNextHourClicked" />
    </div>
    <KAction id="next-step" icon="las la-step-forward" :dense="dense" tooltip="KTimeControl.NEXT_STEP" :handler="onNextStepClicked" />
  </div>
</template>

<script setup>
import moment from 'moment'
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { Time } from '../../time.js'
import { Store } from '../../store.js'
import KDateTime from './KDateTime.vue'

// Data
const isRealtime = Store.get('time.realtime')
const $q = useQuasar()
const stepLabel = ref('1h')
const steps = [
  { id: 'step-05', color: 'primary', label: '5m', value: 5 },
  { id: 'step-10', color: 'primary', label: '10m', value: 10 },
  { id: 'step-12', color: 'primary', label: '12m', value: 12 },
  { id: 'step-15', color: 'primary', label: '15m', value: 15 },
  { id: 'step-20', color: 'primary', label: '20m', value: 20 },
  { id: 'step-30', color: 'primary', label: '30m', value: 30 },
  { id: 'step-60', color: 'primary', label: '1h', value: 60 },
  { id: 'step-180', color: 'primary', label: '3h', value: 180 },
  { id: 'step-360', color: 'primary', label: '6h', value: 360 },
  { id: 'step-1440', color: 'primary', label: '1D', value: 1440 }
]

// Computed
const dateTime = computed({
  get: function () {
    return Time.getCurrentTime().toISOString()
  },
  set: function (value) {
    Time.setCurrentTime(value)
  }
})
const dense = computed(() => {
  return $q.screen.lt.sm
})

// Functions
function onNowClicked () {
  Time.startRealtime()
}
function onPreviousStepClicked () {
  const newTime = moment(Time.getCurrentTime()).subtract(parseInt(stepLabel.value), 'minute')
  Time.setCurrentTime(newTime)
}
function onNextStepClicked () {
  const newTime = moment(Time.getCurrentTime()).add(parseInt(stepLabel.value), 'minute')
  Time.setCurrentTime(newTime)
}
function onStepClicked(step) {
  const selectedStep = steps.find(s => s.label === step);
  if (selectedStep) {
    stepLabel.value = step;
    Time.getStep(selectedStep.value);
  }
}
function onPreviousHourClicked () {
  const newTime = moment(Time.getCurrentTime()).subtract(1, 'hour')
  Time.setCurrentTime(newTime)
}
function onPreviousDayClicked () {
  const newTime = moment(Time.getCurrentTime()).subtract(1, 'day')
  Time.setCurrentTime(newTime)
}
function onNextDayClicked () {
  const newTime = moment(Time.getCurrentTime()).add(1, 'day')
  Time.setCurrentTime(newTime)
}
function onNextHourClicked () {
  const newTime = moment(Time.getCurrentTime()).add(1, 'hour')
  Time.setCurrentTime(newTime)
}
</script>

<style lang="scss" scoped>
  .k-datetime-chip {
    background-color: var(--q-primary);
    color: white;
    border-radius: 50px;
    padding: 0;
    cursor: pointer;
  }
</style>
