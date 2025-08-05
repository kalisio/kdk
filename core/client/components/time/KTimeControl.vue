<template>
  <div id="timecontrols" class="row items-center nowrap">
    <KAction id="previous-step" icon="las la-step-backward" :dense="dense" tooltip="KTimeControl.PREVIOUS_STEP" :handler="onPreviousStepClicked" />
    <div v-if="!dense">
      <KAction id="previous-hour" icon="las la-angle-left" tooltip="KTimeControl.PREVIOUS_HOUR" :handler="onPreviousHourClicked"/>
      <KAction id="previous-day" icon="las la-calendar-minus" tooltip="KTimeControl.PREVIOUS_DAY" :handler="onPreviousDayClicked"/>
    </div>
    <KAction
      id="timecontrol-now"
      icon="las la-user-clock"
      :tooltip="time.realtime ? 'KTimeControl.STOP_REALTIME' : 'KTimeControl.START_REALTIME'"
      :dense="dense"
      :handler="onRealTimeClicked"
    >
      <q-badge v-if="time.realtime" floating rounded color="green">
        <q-icon name="las la-play" size="10px" color="white" />
      </q-badge>
    </KAction>
    <div class="q-px-xs">
      <div class="row items-center k-datetime-chip">
        <KDateTime
          id="datetime-controls"
          v-model="dateTime"
          :timezone="timezone"
          :dense="true"
          :options="{ separator: '|' }"
        />
      </div>
    </div>
    <div class="q-px-xs">
      <q-fab
        id="timecontrol-step"
        color="primary"
        :label="$tie(stepLabel)"
        direction="up"
        hide-icon
        padding="0"
      >
        <template v-slot:tooltip>
          <q-tooltip>
            {{ $t('KTimeControl.SET_STEP') }}
          </q-tooltip>
        </template>
        <template v-for="step in steps" :key="step.id">
          <q-fab-action
            :id="step.label"
            color="primary"
            :label="$tie(step.label)"
            hide-icon
            padding="xs"
            @click="onStepClicked(step.value)"
            style="font-size: 12px;"
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
import _ from 'lodash'
import moment from 'moment'
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { Time } from '../../time.js'
import { Store } from '../../store.js'
import KDateTime from './KDateTime.vue'
import KAction from '../action/KAction.vue'
import SettingsSchema from '../../../../extras/schemas/settings.update.json'

// Data
const $q = useQuasar()
const time = Store.get('time')
const steps = ref(_.get(SettingsSchema, 'properties.timelineStep.field.options', []))

// Computed
const dateTime = computed({
  get: function () {
    return Time.getCurrentTime().toISOString()
  },
  set: function (value) {
    Time.setCurrentTime(value)
  }
})
const timezone = computed(() => {
  return time.format.timezone
})
const stepLabel = computed(() => {
  const step = steps.value.find(s => s.value === time.step)
  return step ? step.label : ''
})
const dense = computed(() => {
  return $q.screen.lt.sm
})

// Functions
function onRealTimeClicked () {
  if (Time.isRealtime()) Time.stopRealtime()
  else Time.startRealtime()
}
function onPreviousStepClicked () {
  const newTime = moment(Time.getCurrentTime()).subtract(Time.getStep(), 'minute')
  Time.setCurrentTime(newTime)
}
function onNextStepClicked () {
  const newTime = moment(Time.getCurrentTime()).add(Time.getStep(), 'minute')
  Time.setCurrentTime(newTime)
}
function onStepClicked (step) {
  Time.setStep(step)
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
    padding: 0 5px;
    cursor: pointer;
  }
</style>
