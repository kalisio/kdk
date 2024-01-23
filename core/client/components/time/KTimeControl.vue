<template>
  <div id="timecontrols" class="row items-center nowrap">
    <KAction id="previous-step" icon="las la-step-backward" :dense="dense" color="primary" tooltip="KTimeControl.PREVIOUS_STEP" handler="onPreviousStepClicked" />
    <KAction id="previous-hour" icon="las la-angle-left" :dense="dense" color="primary" tooltip="KTimeControl.PREVIOUS_HOUR" handler="onPreviousHourClicked"/>
    <KAction id="previous-day" icon="las la-calendar-minus" :dense="dense" color="primary" tooltip="KTimeControl.PREVIOUS_DAY" handler="onPreviousDayClicked"/>
    <KAction id="timecontrol-now" icon="las la-user-clock" :dense="dense" color="primary" tooltip="KTimeControl.SET_NOW" handler="onNowClicked"/>
    <q-btn-group rounded class="bg-primary q-mx-sm">
      <KAction id="timecontrol-date" color="white" label="Date" tooltip="KTimeControl.SET_DATE" handler=".."/>
      <q-separator inset color="white" />
      <KAction id="timecontrol-time" color="white" label="Time" tooltip="KTimeControl.SET_TIME" handler=".."/>
    </q-btn-group>
    <q-fab id="timecontrol-step" vertical-actions-align="center" color="primary" :label="fabLabel" direction="up" padding="0">
      <q-fab-action v-for="item in fabActions" :key="item.id" :id="item.id" :color="item.color" @click="onClick(item.label)" :label="item.label" padding="0" />
    </q-fab>
    <KAction id="next-day" icon="las la-calendar-plus" :dense="dense" color="primary" tooltip="KTimeControl.NEXT_DAY" handler="onNextDayClicked"/>
    <KAction id="next-hour" icon="las la-angle-right" :dense="dense" color="primary" tooltip="KTimeControl.NEXT_HOUR" handler="onNextHourClicked" />
    <KAction id="next-step" icon="las la-step-forward" :dense="dense" color="primary" tooltip="KTimeControl.NEXT_STEP" handler="onNextStepClicked" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

// Data
const $q = useQuasar()

//Fab Actions
const fabLabel = ref('05');
const fabActions = [
  { id: "step-05", color: "primary", label: "05"},
  { id: "step-10", color: "primary", label: "10"},
  { id: "step-12", color: "primary", label: "12"},
  { id: "step-15", color: "primary", label: "15"},
  { id: "step-20", color: "primary", label: "20"},
  { id: "step-30", color: "primary", label: "30"},
  { id: "step-60", color: "primary", label: "60"},
  { id: "step-3H", color: "primary", label: "3H"},
  { id: "step-6H", color: "primary", label: "6H"}
];

// Computed
const dense = computed(() => {
  return $q.screen.lt.sm
})

// Functions
const updateFabLabel = (label) => {
  fabLabel.value = label;
};
const onClick = (label) => {
  updateFabLabel(label);
};
</script>