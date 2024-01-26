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
            <q-time v-model="time" :mask="hourFormat" />
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
const $q = useQuasar()
const stepLabel = ref('05')
const steps = [
  { id: "step-05", color: "primary", label: "5m"},
  { id: "step-10", color: "primary", label: "10m"},
  { id: "step-12", color: "primary", label: "12m"},
  { id: "step-15", color: "primary", label: "15m"},
  { id: "step-20", color: "primary", label: "20m"},
  { id: "step-30", color: "primary", label: "30m"},
  { id: "step-60", color: "primary", label: "1h"},
  { id: "step-3H", color: "primary", label: "3h"},
  { id: "step-6H", color: "primary", label: "6h"},
  { id: "step-1D", color: "primary", label: "KTimeControl.1D"}
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
    return formattedDate
  },
  set: function (value) {
    //TODO
  }
})
const time = computed({
  get: function () {
    return formattedTime
  },
  set: function (value) {
    //TODO
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
  let newTime = moment(Time.getCurrentTime()).subtract(Time.getStep(), 'minute')
  Time.setCurrentTime(newTime)
}
function onNextStepClicked () {
  let newTime = moment(Time.getCurrentTime()).add(Time.getStep(), 'minute')
  Time.setCurrentTime(newTime)
}
function onStepClicked (step) {
  stepLabel.value = step
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