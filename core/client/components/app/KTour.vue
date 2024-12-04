<template>
  <v-tour name="tour" ref="tourRef" :steps="tourSteps" :options="tourOptions" :callbacks="tourCallbacks">
    <template v-slot:default="tour">
      <q-card>
        <v-step v-if="isStepVisible && (tour.currentStep >= 0)"
          :key="tour.currentStep"
          :step="step"
          :previous-step="tour.previousStep"
          :next-step="tour.nextStep"
          :stop="tour.stop"
          :skip="tour.skip"
          :finish="tour.finish"
          :is-first="tour.isFirst"
          :is-last="tour.isLast"
          :labels="tour.labels"
          :highlight="tour.highlight"
          :debug="tour.debug"
        >
          <template v-slot:header class="text-white">
            <q-card-section class="q-pa-xs q-ma-xs">
              <div v-if="step.title" v-html="step.title"></div>
            </q-card-section>
            <q-separator v-if="step.title && (step.content || step.link)" color="white"/>
          </template>
          <template v-slot:content class="text-white">
            <q-card-section class="q-pa-xs q-ma-xs">
              <div v-if="step.content" v-html="step.content"></div>
            </q-card-section>
            <q-separator v-if="step.content && step.link" color="white"/>
            <q-card-section class="q-pa-xs q-ma-xs" v-if="step.link">
              <span v-html="step.link"></span>
              <q-icon class="cursor-pointer" size="1.5rem" name="las la-external-link-square-alt" @click="onLink()"/>
            </q-card-section>
          </template>
          <template v-slot:actions class="row justify-center">
            <q-card-actions align="center">
              <q-btn v-if="hasPreviousButton(step)" id="previous-step-tour" icon="las la-chevron-left" color="primary" text-color="white" dense outline @click.prevent="tour.previousStep"></q-btn>
              <q-btn v-if="hasSkipButton(step)" id="skip-tour" icon="las la-times" color="primary" text-color="white" dense outline @click.prevent="tour.skip"></q-btn>
              <q-btn  v-if="hasFinishButton(step)" id="finish-tour" icon="las la-times" color="primary" text-color="white" dense outline @click.prevent="tour.finish"></q-btn>
              <q-btn v-if="hasLinkButton(step)" icon="las la-link" dense outline text-color="white" @click="onLink()" />
              <q-btn v-if="hasNextButton(step)" id="next-step-tour" icon="las la-chevron-right" color="primary" text-color="white" dense outline @click.prevent="tour.nextStep"></q-btn>
            </q-card-actions>
          </template>
        </v-step>
      </q-card>
    </template>
  </v-tour>
</template>

<script setup>
import _ from 'lodash'
import logger from 'loglevel'
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Notify } from 'quasar'
import { Store, Events, i18n, beforeGuard } from '../..'

// Data
const router = useRouter()
const route = useRoute()
const tourRef = ref()
const tourSteps = ref([])
const tourOptions = ref({
  highlight: true,
  useKeyboardNavigation: true,
  labels: {
    buttonSkip: i18n.t('KTour.SKIP_LABEL'),
    buttonPrevious: i18n.t('KTour.PREVIOUS_LABEL'),
    buttonNext: i18n.t('KTour.NEXT_LABEL'),
    buttonStop: i18n.t('KTour.FINISH_LABEL')
  },
  startTimeout: 1000
})
const tourCallbacks = ref({
  onStart: onStartTour,
  onPreviousStep: onPreviousTourStep,
  onNextStep: onNextTourStep,
  onSkip: onSkipTour,
  onFinish: onFinishTour,
  onStop: onStopTour
})
const isStepVisible = ref(true)
let isRunning = false

// Functions
function hasLinkButton (step) {
  return _.has(step, 'params.route') && !_.has(step, 'link') // Only if no link label
}
function hasPreviousButton (step) {
  return !getTour().isFirst.value && _.get(getStep(), 'params.previousButton', true)
}
function hasNextButton (step) {
  return !getTour().isLast.value && _.get(getStep(), 'params.nextButton', true)
}
function hasSkipButton (step) {
  return !getTour().isLast.value && _.get(getStep(), 'params.skipButton', true)
}
function hasFinishButton (step) {
  return getTour().isLast.value && _.get(getStep(), 'params.finishButton', true)
}
function getTour () {
  return tourRef.value.$tours.tour
}
function getStep (step) {
  step = (_.isNil(step) ? getTour().currentStep.value : step)
  return (_.isNil(step) || (step < 0) ? null : tourSteps.value[step])
}
function launchTour (step) {
  getTour().start(step)
}
function playTour (step) {
  getTour().start(step)
}
function setCurrentTour () {
  const selected = Store.get('tours.current', {})
  if (_.isEmpty(selected) || !selected.name) return
  // Inject before hooks in steps
  const steps = Store.get(`tours.${selected.name}`, [])
  // Replacing the array does not seem to work with reactivity
  tourSteps.value.splice(0, tourSteps.value.length, ...steps)
  // Process translations and before hooks
  tourSteps.value.forEach(step => {
    if (_.has(step, 'title')) _.set(step, 'title', i18n.t(_.get(step, 'title')))
    if (_.has(step, 'content')) _.set(step, 'content', i18n.t(_.get(step, 'content')))
    if (_.has(step, 'link')) _.set(step, 'link', i18n.t(_.get(step, 'link')))
    _.set(step, 'before', beforeStep)
  })
  if (tourSteps.value.length > 0) {
    // Stop previous tour if any
    if (getTour().isRunning) getTour().stop()
    if (selected.play) playTour(selected.step || 0)
    else launchTour(selected.step || 0)
  }
}
function refreshTour () {
  let tour = _.get(route, 'query.tour', '')
  // Can be boolean as string
  if (typeof tour === 'string') tour = tour.toLowerCase()
  if (!tour || (tour === 'false')) return
  // By default use the route name as tour name if tour equals simply true
  let name = route.name
  // Manage routes with different pages
  if (_.get(route, 'params.page')) {
    name += '/' + _.get(route, 'params.page')
  }
  // This can be overriden when multiple tours target the same route,
  // e.g. when the route has a parameter and each value has its own tour
  // Take care that query param can be boolean given as string
  if ((typeof tour === 'string') && (tour !== 'true')) name = tour
  // No corresponding tour ?
  if (!Store.has(`tours.${name}`)) return
  // Trigger a refresh if required to avoid reentrance
  const selected = Store.get('tours.current.name', '')
  // Check if we are really on a different tour when multiple tours target the same route
  if ((selected !== name) && (!selected.startsWith(name + '/'))) {
    setTimeout(() => {
      const step = (_.has(route, 'query.tourStep')
        ? _.toNumber(_.get(route, 'query.tourStep'))
        : undefined)
      const play = _.get(route, 'query.playTour')
      Store.patch('tours.current', { name, step, play })
    }, _.toNumber(_.get(route, 'query.tourDelay', 0)))
  }
}
function getTarget (target) {
  let element = null
  let querySelectorAll = false
  const brackets = /\[([0-9]*?)\]/i
  // Check if there is an array notation like '#action[1]'
  // This is useful for id conflict resolution
  const result = brackets.exec(target)
  if (result) {
    const index = _.toNumber(result[1])
    if (_.isFinite(index)) {
      // Tag that the request conforms querySelectorAll
      querySelectorAll = true
      // Remove the brackets to get all elements of this type
      try {
        const elements = document.querySelectorAll(target.replace(result[0], ''))
        // Then retrieve the right index
        if (index < elements.length) element = elements[index]
      } catch (error) {
        logger.debug('[KDK] Looking for tour target', error)
      }
    }
  }
  // If the request does not conform querySelectorAll
  if (!querySelectorAll && !element) {
    try {
      element = document.querySelector(target)
    } catch (error) {
      logger.debug('[KDK] Looking for tour target', error)
    }
    // Do not return invisible target
    // FIXME: does not work when element is hidden by parent
    // if (element && getComputedStyle(element).display === 'none') element = null
    if (element && element.getClientRects().length === 0) element = null
  }
  return element
}
function clickTarget (step) {
  step = getStep(step)
  if (_.has(step, 'params.clickDelay')) {
    const delay = _.get(step, 'params.clickDelay')
    setTimeout(() => {
      const target = getTarget(_.get(step, 'params.clickOn', _.get(step, 'target')))
      if (target) target.click()
    }, _.toNumber(delay))
  }
}
function getTargetsOn (param) {
  const step = getStep()
  let targets = _.get(step, `params.${param}`, [])
  if (!Array.isArray(targets)) targets = [targets]
  return targets
}
function processElement (param, callback) {
  const targets = getTargetsOn(param)
  let processed = false
  targets.forEach(async target => {
    // Need to add a debounce because the previous element is not yet present in the DOM
    if (targets.length > 1) await new Promise(resolve => { setTimeout(resolve, 100) })
    target = getTarget(target)
    if (target) {
      try {
        callback(target)
        processed |= true
      } catch (error) {
        processed |= false
      }
    }
  })
  return processed
}
function hoverOn (param) {
  // Simulate a mouse over
  return processElement(param, target => target.dispatchEvent(new MouseEvent('mouseover', {
    view: window,
    bubbles: true,
    cancelable: true
  })))
}
function clickOn (param) {
  // Simulate a click
  return processElement(param, target => target.click())
}
function hoverClickOn (param) {
  return processElement(param, target => {
    // Simulate a mouse over
    target.dispatchEvent(new MouseEvent('mouseover', {
      view: window,
      bubbles: true,
      cancelable: true
    }))
    target.click()
  })
}
function typeTextOn (param, text) {
  const step = getStep()
  // Simulate input
  return processElement(param, target => {
    target.focus()
    // Need to add a debounce as the focus does not immediately trigger the input
    setTimeout(() => {
      target.value = _.get(step, `params.${text}`)
      target.dispatchEvent(new Event('input'))
    }, 100)
  })
}
function blockOnMiss () {
  let missing = false
  const step = getStep()
  if (_.has(step, 'params.blockOnMiss')) {
    const targets = getTargetsOn('blockOnMiss')
    targets.forEach(target => {
      if (!getTarget(target)) missing = true
    })
    if (missing) {
      Notify.create({ type: 'warning', message: i18n.t('KTour.MISS_ERROR') })
    }
  }
  return missing
}
function beforeStep (type) {
  let param
  switch (type) {
    case 'previous':
      param = 'OnPrevious'
      break
    case 'next':
      if (blockOnMiss()) return
      param = 'OnNext'
      break
    case 'start':
    default:
      isStepVisible.value = true
      return
  }
  // Check if step is visible, otherwise d'ont process element according to next/previous step
  if (isStepVisible.value === false) return
  // Process element according to next/previous step
  hoverOn('hover' + param)
  clickOn('click' + param)
  hoverClickOn('hoverClick' + param)
  typeTextOn('typeText' + param, 'text' + param)
  const step = getStep()
  const delay = _.get(step, 'params.' + type + 'Delay', 0)
  isStepVisible.value = false
  return new Promise((resolve, reject) => {
    setTimeout(() => { resolve() }, _.toNumber(delay))
  })
}
function stop () {
  isStepVisible.value = false
  isRunning = false
  // Remove any query param related to tour
  router.replace({
    query: _.omit(_.get(route, 'query', {}), ['tour', 'playTour', 'tourStep']),
    params: _.get(route, 'params', {})
  }).catch(_ => {})
}
async function onLink () {
  const step = getStep()
  hoverOn('hoverOnLink')
  clickOn('clickOnLink')
  hoverClickOn('hoverClickOnLink')
  // Need to add a debounce because the previous element is not yet present in the DOM
  await new Promise((resolve, reject) => {
    setTimeout(() => { resolve() }, 100)
  })
  if (_.has(step, 'params.route')) {
    // Stop current tour before starting next one
    getTour().stop()
    // Keep it as running however so that
    // route guard adding tour query params will still be active
    isRunning = true
    router.replace(_.get(step, 'params.route')).catch(_ => {})
  } else if (_.has(step, 'params.tour')) {
    // Stop current tour before starting next one
    getTour().stop()
    // Tour name can be prefixed by route if different pages are available
    const name = _.get(step, 'params.tour')
    const delay = _.get(step, 'params.tourDelay', 0)
    setTimeout(() => {
      if (Store.has(`tours.${route.name}/${name}`)) {
        Store.patch('tours.current', { name: `${route.name}/${name}`, step: 0 })
      } else {
        Store.patch('tours.current', { name, step: 0 })
      }
    }, _.toNumber(delay))
  } else if (_.has(step, 'params.nextDelay')) {
    const delay = _.get(step, 'params.nextDelay')
    setTimeout(() => getTour().nextStep(), _.toNumber(delay))
  }
}
function onStartTour (currentStep) {
  isRunning = true
  // Check if target is found, otherwise skip and try go to next step
  const step = getStep(0)
  const target = getTarget(_.get(step, 'target'))
  if (!target) {
    isStepVisible.value = false
    // Need to add a debounce as the step number has not yet changed, it will on function return
    setTimeout(() => {
      if (getTour().currentStep.value < getTour().numberOfSteps.value - 1) getTour().nextStep()
      else getTour().stop()
    }, 100)
  }
  clickTarget()
}
function onPreviousTourStep (currentStep) {
  clickTarget(currentStep - 1)
  isStepVisible.value = true
  // Check if target is found, otherwise skip and try go to previous step
  const step = getStep(currentStep - 1)
  const target = getTarget(_.get(step, 'target'))
  if (!target) {
    isStepVisible.value = false
    // Need to add a debounce as the step number has not yet changed, it will on function return
    setTimeout(() => {
      if (getTour().currentStep.value > 0) getTour().previousStep()
      else getTour().stop()
    }, 100)
  }
}
function onNextTourStep (currentStep) {
  clickTarget(currentStep + 1)
  isStepVisible.value = true
  // Check if target is found, otherwise skip and try go to next step
  const step = getStep(currentStep + 1)
  const target = getTarget(_.get(step, 'target'))
  if (!target) {
    isStepVisible.value = false
    // Need to add a debounce as the step number has not yet changed, it will on function return
    setTimeout(() => {
      if (getTour().currentStep.value < getTour().numberOfSteps.value - 1) getTour().nextStep()
      else getTour().stop()
    }, 100)
  }
}
function onSkipTour () {
  stop()
}
function onFinishTour () {
  stop()
}
function onStopTour () {
  stop()
}
function beforeRoute (to, from, next) {
  // When running a tour, each called route will also be pushed as a tour
  if (isRunning) {
    _.merge(to, { query: { tour: true } })
  }
  next()
}

// Hooks
onMounted(() => {
  beforeGuard.unregisterGuard = router.beforeEach(beforeRoute)
  refreshTour()
})
onBeforeUnmount(() => {
  beforeGuard.unregisterGuard()
  Events.off('tours-current-changed', setCurrentTour)
})

// Computed
const step = computed(() => getStep())

// Watch
watch(route, (to, from) => refreshTour())

// immediate
Events.on('tours-current-changed', setCurrentTour)
</script>

<style lang="scss" scoped>
  .v-step {
    background: $accent;
    z-index: 10000;
  }
  .v-tour__target--highlighted {
    box-shadow: 0 0 0 99999px rgba(0,0,0,.4);
  }
</style>
