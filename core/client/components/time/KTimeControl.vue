<template>
  <div id="timecontrols" class="row items-center nowrap">
    <KAction id="previous-step" icon="las la-step-backward" :dense="dense" tooltip="KTimeControl.PREVIOUS_STEP" :handler="onPreviousStepClicked" />
    <div v-if="!dense">
      <KAction id="previous-hour" icon="las la-angle-left" tooltip="KTimeControl.PREVIOUS_HOUR" :handler="onPreviousHourClicked"/>
      <KAction id="previous-day" icon="las la-calendar-minus" tooltip="KTimeControl.PREVIOUS_DAY" :handler="onPreviousDayClicked"/>
    </div>
    <KAction id="timecontrol-now" icon="las la-user-clock" :dense="dense" tooltip="KTimeControl.SET_NOW" :handler="onNowClicked"/>
    <div class="q-px-md">
      <div class="row items-center k-datetime-chip">
        <div class="q-px-xs">
          {{  formattedDate }}
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-date v-model="date" :mask="calendarDateMask" today-btn minimal />
          </q-popup-proxy>
        </div>
        <div class="q-px-xs">|</div>
        <div class="q-px-xs">
          {{  formattedTime }}
          <q-popup-proxy transition-show="scale" transition-hide="scale">
            <q-time v-model="time" :mask="timeDateMask" />
          </q-popup-proxy>
        </div>
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

// Data
const calendarDateMask = 'YYYY-MM-DD'
const timeDateMask = 'HH:mm'

const $q = useQuasar()
const stepLabel = ref('60m')
const steps = [
  { id: "step-05", color: "primary", label: "5m"},
  { id: "step-10", color: "primary", label: "10m"},
  { id: "step-12", color: "primary", label: "12m"},
  { id: "step-15", color: "primary", label: "15m"},
  { id: "step-20", color: "primary", label: "20m"},
  { id: "step-30", color: "primary", label: "30m"},
  { id: "step-60", color: "primary", label: "60m"},
  { id: "step-180", color: "primary", label: "180m"},
  { id: "step-360", color: "primary", label: "360m"},
  { id: "step-1440", color: "primary", label: "1440m"}
]

// Computed
const formattedDate = computed(() => {
  return Time.getCurrentFormattedTime().date.long
})
const formattedTime = computed(() => {
  return Time.getCurrentFormattedTime().time.long
})
const date = computed({
  get: function () {
    const dateTime = Time.getCurrentTime()
    // Assume locale if timezone not provided
    return Time.getFormatTimezone()
      ? moment(dateTime).tz(Time.getFormatTimezone()).format(calendarDateMask)
      : moment(dateTime).local().format(calendarDateMask)
  },
  set: function (value) {
    let newDate
    const currentTime = Time.getCurrentTime()

    const [year, month, day] = value.split('-')

    newDate = moment(currentTime)
      .year(parseInt(year))
      .month(parseInt(month) - 1)
      .date(parseInt(day))

    Time.setCurrentTime(newDate)
  }
})
const time = computed({
  get: function () {
    const dateTime = Time.getCurrentTime()
    // Assume locale if timezone not provided
    return Time.getFormatTimezone()
      ? moment(dateTime).tz(Time.getFormatTimezone()).format(timeDateMask)
      : moment(dateTime).local().format(timeDateMask)
  },
  set: function (value) {
    let newTime;
    const currentDateTime = Time.getCurrentTime()

    const [hours, minutes] = value.split(':')
    newTime = moment(currentDateTime)
      .hour(parseInt(hours))
      .minute(parseInt(minutes))

    Time.setCurrentTime(newTime)
  }
})
const dense = computed(() => {
  return $q.screen.lt.sm
})

// Functions

function onNowClicked() {
  Time.startRealtime()
}
function onPreviousStepClicked() {
  let newTime = moment(Time.getCurrentTime()).subtract(parseInt(stepLabel.value), 'minute')
  Time.setCurrentTime(newTime)
}
function onNextStepClicked() {
  let newTime = moment(Time.getCurrentTime()).add(parseInt(stepLabel.value), 'minute')
  Time.setCurrentTime(newTime)
}
function onStepClicked(step) {
  stepLabel.value = step
  
  switch (step) {
    case '5m':
      Time.setStep(5)
      break
    case '10m':
      Time.setStep(10)
      break
    case '12m':
      Time.setStep(12)
      break
    case '15m':
      Time.setStep(15)
      break
    case '20m':
      Time.setStep(20)
      break
    case '30m':
      Time.setStep(30)
      break
    case '60m':
      Time.setStep(60)
      break
    case '180m':
      Time.setStep(180)
      break
    case '360m':
      Time.setStep(360)
      break
    case '1440m':
      Time.setStep(1440)
      break
    default:
      break
  }
}
function onPreviousHourClicked() {
  const newTime = moment(Time.getCurrentTime()).subtract(1, 'hour')
  Time.setCurrentTime(newTime)
}
function onPreviousDayClicked() {
  const newTime = moment(Time.getCurrentTime()).subtract(1, 'day')
  Time.setCurrentTime(newTime)
}
function onNextDayClicked() {
  const newTime = moment(Time.getCurrentTime()).add(1, 'day')
  Time.setCurrentTime(newTime)
}
function onNextHourClicked() {
  const newTime = moment(Time.getCurrentTime()).add(1, 'hour');
  Time.setCurrentTime(newTime)
}
</script>

<style lang="scss" scoped>
  .k-datetime-chip {
    background-color: var(--q-primary);
    color: white;
    border-radius: 12px;
    padding: 2px 5px 2px 5px;
    cursor: pointer;
  }
</style>