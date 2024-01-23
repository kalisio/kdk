<template>
  <div class="row items-center nowrap">
    <KAction id="previous-step" icon="" tooltip="KTimeControl.PREVIOUS_STEP" handler="onPreviousStepClicked" />
    <KAction id="previous-hour" icon="" tooltip="KTimeControl.PREVIOUS_HOUR" handler="onPreviousHourClicked"/>
    <KAction id="previous-day" icon="" tooltip="KTimeControl.PREVIOUS_DAY" handler="onPreviousDayClicked"/>
    <KAction id="set-now" icon="" tooltip="KTimeControl.SET_NOW" handler="..."/>
    <q-btn-group>
      <KAction id="set-date" label="..." tooltip="KTimeControl.SET_DATE" handler="..."/>
      <KAction id="set-time" label="..." tooltip="KTimeCOntrol.SET_TIME" handler="..."/>
    </q-btn-group>
    <q-fab v-model="fabCenter" vertical-actions-align="center" color="primary" label="30" direction="up">
      <q-fab-action id="" color="primary" @click="onClick" label="05"/>
      <q-fab-action id="" color="primary" @click="onClick" label="10"/>
      <q-fab-action id="" color="primary" @click="onClick" label="12"/>
      <q-fab-action id="" color="primary" @click="onClick" label="15"/>
      <q-fab-action id="" color="primary" @click="onClick" label="20"/>
      <q-fab-action id="" color="primary" @click="onClick" label="30"/>
      <q-fab-action id="" color="primary" @click="onClick" label="60"/>
      <q-fab-action id="" color="primary" @click="onClick" label="3H"/>
      <q-fab-action id="" color="primary" @click="onClick" label="6H"/>
    </q-fab>
    <KAction id="next-day" icon="" tooltip="KTimeControl.NEXT_DAY" handler="onNextDayClicked"/>
    <KAction id="next-hour" icon="" tooltip="KTimeControl.NEXT_HOUR" handler="onNextHourClicked" />
    <KAction id="next-step" icon="" tooltip="KTimeControl.NEXT_STEP" handler="onNextStepClicked" />
  </div>
</template>
<script setup>

</script>