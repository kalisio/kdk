<template>
  <div class="row items-center nowrap">
    <KAction id="previous-step" icon="las la-step-backward" size="md" color="primary" tooltip="KTimeControl.PREVIOUS_STEP" handler="onPreviousStepClicked" />
    <KAction id="previous-hour" icon="las la-angle-left" size="md" color="primary" tooltip="KTimeControl.PREVIOUS_HOUR" handler="onPreviousHourClicked"/>
    <KAction id="previous-day" icon="las la-calendar-minus" size="md" color="primary" tooltip="KTimeControl.PREVIOUS_DAY" handler="onPreviousDayClicked"/>
    <KAction id="timecontrol-now" icon="las la-user-clock" size="md" color="primary" tooltip="KTimeControl.SET_NOW" handler="onNowClicked"/>
    <q-btn-group>
      <KAction id="timecontrol-date" label=".." tooltip="KTimeControl.SET_DATE" handler=".."/>
      <KAction id="timecontrol-time" label="formatTime(time, 'date.long') + ' ' + formatTime(time, 'time.long')" tooltip="KTimeControl.SET_TIME" handler=".."/>
    </q-btn-group>
    <q-fab id="timecontrol-step" v-model="fabCenter" vertical-actions-align="center" color="primary" label=".." direction="up">
      <q-fab-action id="step-05" color="primary" @click="onClick" label="05"/>
      <q-fab-action id="step-10" color="primary" @click="onClick" label="10"/>
      <q-fab-action id="step-12" color="primary" @click="onClick" label="12"/>
      <q-fab-action id="step-15" color="primary" @click="onClick" label="15"/>
      <q-fab-action id="step-20" color="primary" @click="onClick" label="20"/>
      <q-fab-action id="step-30" color="primary" @click="onClick" label="30"/>
      <q-fab-action id="step-60" color="primary" @click="onClick" label="60"/>
      <q-fab-action id="step-3H" color="primary" @click="onClick" label="3H"/>
      <q-fab-action id="step-6H" color="primary" @click="onClick" label="6H"/>
    </q-fab>
    <KAction id="next-day" icon="las la-calendar-plus" size="md" color="primary" tooltip="KTimeControl.NEXT_DAY" handler="onNextDayClicked"/>
    <KAction id="next-hour" icon="las la-angle-right" size="md" color="primary" tooltip="KTimeControl.NEXT_HOUR" handler="onNextHourClicked" />
    <KAction id="next-step" icon="las la-step-forward" size="md" color="primary" tooltip="KTimeControl.NEXT_STEP" handler="onNextStepClicked" />
  </div>
</template>
<script setup>
</script>