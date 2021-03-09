 <template>
  <v-tour name="tour" ref="tour" :steps="tourSteps" :options="tourOptions" :callbacks="tourCallbacks">
    <template slot-scope="tour">
      <q-card>
        <v-step
          v-for="(step, index) of tour.steps"
          v-if="isStepVisible && (tour.currentStep === index)"
          :key="index"
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
          <div slot="header" class="text-white">
            <q-card-section class="q-pa-xs q-ma-xs" v-if="step.title">
              <div v-html="step.title"></div>
            </q-card-section>
            <q-separator v-if="step.title && (step.content || step.link)" color="white"/>
          </div>
          <div slot="content" class="text-white">
            <q-card-section class="q-pa-xs q-ma-xs" v-if="step.content">
              <div v-html="step.content"></div>
            </q-card-section>
            <q-separator v-if="step.content && step.link" color="white"/>
            <q-card-section class="q-pa-xs q-ma-xs" v-if="step.link">
              <span v-html="step.link"></span>
              <q-icon class="cursor-pointer" size="1.5rem" name="las la-external-link-square-alt" @click="onLink()"/>
            </q-card-section>
          </div>
          <div slot="actions" class="row justify-center">
            <q-card-actions align="right">
              <q-btn v-if="hasPreviousButton(step)" id="previous-step-tour" icon="las la-chevron-left" color="primary" text-color="white" dense outline @click.prevent="previousStep"></q-btn>
              <q-btn v-if="hasSkipButton(step)" id="skip-tour" icon="las la-times" color="primary" text-color="white" dense outline @click.prevent="tour.skip"></q-btn>
              <q-btn  v-if="hasFinishButton(step)" id="finish-tour" icon="las la-times" color="primary" text-color="white" dense outline @click.prevent="tour.finish"></q-btn>
              <q-btn v-if="hasLinkButton(step)" icon="las la-link" dense outline text-color="white" @click="onLink()" />
              <q-btn v-if="hasNextButton(step)" id="next-step-tour" icon="las la-chevron-right" color="primary" text-color="white" dense outline @click.prevent="nextStep"></q-btn>
            </q-card-actions>
          </div>
        </v-step>
      </q-card>
    </template>
  </v-tour>
</template>

<script>
import _ from 'lodash'
import logger from 'loglevel'

export default {
  name: 'k-tour',
  data () {
    return {
      tourSteps: [],
      tourOptions: {
        highlight: true,
        useKeyboardNavigation: true,
        labels: {
          buttonSkip: this.$i18n.t('KTour.SKIP_LABEL'),
          buttonPrevious: this.$i18n.t('KTour.PREVIOUS_LABEL'),
          buttonNext: this.$i18n.t('KTour.NEXT_LABEL'),
          buttonStop: this.$i18n.t('KTour.FINISH_LABEL')
        },
        startTimeout: 1000,
        autoPlayDelay: 5000
      },
      tourCallbacks: {
        onStart: this.onStartTour,
        onPreviousStep: this.onPreviousTourStep,
        onNextStep: this.onNextTourStep,
        onSkip: this.onSkipTour,
        onFinish: this.onFinishTour,
        onStop: this.onStopTour
      },
      autoPlay: false,
      isStepVisible: true
    }
  },
  watch: {
    '$route' (to, from) {
      // React to route changes by loading any tour
      this.refreshTour()
    }
  },
  methods: {
    hasLinkButton (step) {
      return !this.autoPlay && _.has(step, 'params.route') && !_.has(step, 'link') // Only if no link label
    },
    hasPreviousButton (step) {
      return !this.autoPlay && !this.getTour().isFirst && _.get(this.getStep(), 'params.previousButton', true)
    },
    hasNextButton (step) {
      return !this.autoPlay && !this.getTour().isLast && _.get(this.getStep(), 'params.nextButton', true)
    },
    hasSkipButton (step) {
      return !this.getTour().isLast && _.get(this.getStep(), 'params.skipButton', true)
    },
    hasFinishButton (step) {
      return !this.autoPlay && this.getTour().isLast && _.get(this.getStep(), 'params.finishButton', true)
    },
    getTour () {
      return this.$refs.tour
    },
    getStep (step) {
      step = (_.isNil(step) ? _.get(this.$refs, 'tour.currentStep') : step)
      return (_.isNil(step) || (step < 0) ? null : this.tourSteps[step])
    },
    launchTour (step) {
      this.getTour().start(step)
      this.autoPlay = false
    },
    playTour (step) {
      this.getTour().start(step)
      this.autoPlay = true
    },
    setCurrentTour () {
      const selected = this.$store.get('tours.current', {})
      if (_.isEmpty(selected) || !selected.name) return
      this.tourSteps = this.$store.get(`tours.${selected.name}`, [])
      // Process translations
      this.tourSteps.forEach(step => {
        if (_.has(step, 'title')) _.set(step, 'title', this.$t(_.get(step, 'title')))
        if (_.has(step, 'content')) _.set(step, 'content', this.$t(_.get(step, 'content')))
        if (_.has(step, 'link')) _.set(step, 'link', this.$t(_.get(step, 'link')))
      })
      if (this.tourSteps.length > 0) {
        // Stop previous tour if any
        if (this.getTour().isRunning) this.getTour().stop()
        if (selected.play) this.playTour(selected.step || 0)
        else this.launchTour(selected.step || 0)
      }
    },
    refreshTour () {
      let tour = _.get(this.$route, 'query.tour', '')
      // Can be boolean as string
      if (typeof tour === 'string') tour = tour.toLowerCase()
      if (!tour || (tour === 'false')) return
      // By default use the route name as tour name if tour equals simply true
      let name = this.$route.name
      // Manage routes with different pages
      if (_.get(this.$route, 'params.page')) {
        name += '/' + _.get(this.$route, 'params.page')
      }
      // This can be overriden when multiple tours target the same route,
      // e.g. when the route has a parameter and each value has its own tour
      // Take care that query param can be boolean given as string
      if ((typeof tour === 'string') && (tour !== 'true')) name = tour
      // No corresponding tour ?
      if (!this.$store.has(`tours.${name}`)) return
      // Trigger a refresh if required to avoid reentrance
      const selected = this.$store.get('tours.current', {})
      if (selected !== name) {
        setTimeout(() => {
          const step = (_.has(this.$route, 'query.tourStep')
            ? _.toNumber(_.get(this.$route, 'query.tourStep')) : undefined)
          const play = _.get(this.$route, 'query.playTour')
          this.$store.patch('tours.current', { name, step, play })
        }, _.toNumber(_.get(this.$route, 'query.tourDelay', 0)))
      }
    },
    autoPlayNextStep () {
      const delay = _.get(this.getStep(), 'params.autoPlayDelay', this.tourOptions.autoPlayDelay)
      this.playTimer = setTimeout(() => {
        if (!this.getTour().isLast) this.nextStep()
        else this.getTour().stop()
      }, delay)
    },
    getTarget (target) {
      let element = null
      let querySelectorAll = false
      const brackets = new RegExp(/\[(.*?)\]/, 'i')
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
            logger.debug('Looking for tour target', error)
          }
        }
      }
      // If the request does not conform querySelectorAll
      if (!querySelectorAll && !element) {
        try {
          element = document.querySelector(target)
        } catch (error) {
          logger.debug('Looking for tour target', error)
        }
        // Do not return invisible target
        // FIXME: does not work when element is hidden by parent
        // if (element && getComputedStyle(element).display === 'none') element = null
        if (element && element.getClientRects().length === 0) element = null
      }
      return element
    },
    clickTarget (step) {
      step = this.getStep(step)
      if (_.has(step, 'params.clickDelay')) {
        const delay = _.get(step, 'params.clickDelay')
        setTimeout(() => {
          const target = this.getTarget(_.get(step, 'params.clickOn', _.get(step, 'target')))
          if (target) target.click()
        }, _.toNumber(delay))
      }
    },
    getTargetsOn (param) {
      const step = this.getStep()
      let targets = _.get(step, `params.${param}`, [])
      if (!Array.isArray(targets)) targets = [targets]
      return targets
    },
    processElement (param, callback) {
      const targets = this.getTargetsOn(param)
      let processed = false
      targets.forEach(target => {
        target = this.getTarget(target)
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
    },
    hoverOn (param) {
      // Simulate a mouse over
      return this.processElement(param, target => target.dispatchEvent(new MouseEvent('mouseover', {
        view: window,
        bubbles: true,
        cancelable: true
      })))
    },
    clickOn (param) {
      // Simulate a click
      return this.processElement(param, target => target.click())
    },
    hoverClickOn (param) {
      return this.processElement(param, async target => {
        // Simulate a mouse over
        target.dispatchEvent(new MouseEvent('mouseover', {
          view: window,
          bubbles: true,
          cancelable: true
        }))
        // Then a click: force a refresh first so that DOM will be updated by Vuejs if required
        await this.$nextTick()
        target.click()
      })
    },
    blockOnMiss () {
      let missing = false
      const step = this.getStep()
      if (_.has(step, 'params.blockOnMiss')) {
        const targets = this.getTargetsOn('blockOnMiss')
        targets.forEach(target => {
          if (!this.getTarget(target)) missing = true
        })
        if (missing) {
          this.$toast({ message: this.$t('KTour.MISS_ERROR'), color: 'warning' })
        }
      }
      return missing
    },
    nextStep () {
      if ((this.getTour().currentStep >= this.getTour().numberOfSteps - 1) ||
          (this.getTour().currentStep === -1)) return
      if (this.blockOnMiss()) return
      this.hoverOn('hoverOnNext')
      this.clickOn('clickOnNext')
      this.hoverClickOn('hoverClickOnNext')
      let step = this.getStep()
      const delay = _.get(step, 'params.nextDelay', 0)
      this.isStepVisible = false
      setTimeout(() => {
        this.getTour().nextTourStep()
        this.isStepVisible = true
        // Check if target is found, otherwise skip and try go to next step
        step = this.getStep()
        const target = this.getTarget(_.get(step, 'target'))
        if (!target) {
          if (this.getTour().currentStep < this.getTour().numberOfSteps - 1) this.nextStep()
          else this.getTour().stop()
        }
      }, _.toNumber(delay))
    },
    previousStep () {
      if (this.getTour().currentStep <= 0) return
      this.hoverOn('hoverOnPrevious')
      this.clickOn('clickOnPrevious')
      this.hoverClickOn('hoverClickOnPrevious')
      let step = this.getStep()
      const delay = _.get(step, 'params.previousDelay', 0)
      this.isStepVisible = false
      setTimeout(() => {
        this.getTour().previousTourStep()
        this.isStepVisible = true
        // Check if target is found, otherwise skip and try go to previous step
        step = this.getStep()
        const target = this.getTarget(_.get(step, 'target'))
        if (!target) {
          if (this.getTour().currentStep > 0) this.previousStep()
          else this.getTour().stop()
        }
      }, _.toNumber(delay))
    },
    stop () {
      this.isRunning = false
      if (this.playTimer) {
        clearInterval(this.playTimer)
        this.playTimer = null
        this.autoPlay = false
      }
      // Remove any query param related to tour
      this.$router.replace({
        query: _.omit(_.get(this.$route, 'query', {}), ['tour', 'playTour', 'tourStep']),
        params: _.get(this.$route, 'params', {})
      }).catch(_ => {})
    },
    onLink () {
      const step = this.getStep()
      this.hoverOn('hoverOnLink')
      this.clickOn('clickOnLink')
      this.hoverClickOn('hoverClickOnLink')
      if (_.has(step, 'params.route')) {
        // Stop current tour before starting next one
        this.getTour().stop()
        // Keep it as running however so that
        // route guard adding tour query params will still be active
        this.isRunning = true
        this.$router.replace(_.get(step, 'params.route')).catch(_ => {})
      } else if (_.has(step, 'params.tour')) {
        // Stop current tour before starting next one
        this.getTour().stop()
        // Tour name can be prefixed by route if different pages are available
        const name = _.get(step, 'params.tour')
        const route = this.$route.name
        if (this.$store.has(`tours.${route}/${name}`)) {
          this.$store.patch('tours.current', { name: `${route}/${name}` })
        } else {
          this.$store.patch('tours.current', { name })
        }
      } else if (_.has(step, 'params.nextDelay')) {
        const delay = _.get(step, 'params.nextDelay')
        setTimeout(() => this.nextStep(), _.toNumber(delay))
      }
    },
    onStartTour () {
      this.isRunning = true
      if (this.autoPlay) this.autoPlayNextStep()
      this.clickTarget()
    },
    onPreviousTourStep (currentStep) {
      this.clickTarget(currentStep - 1)
    },
    onNextTourStep (currentStep) {
      if (this.autoPlay) this.autoPlayNextStep()
      this.clickTarget(currentStep + 1)
    },
    onSkipTour () {
      this.stop()
    },
    onFinishTour () {
      this.stop()
    },
    onStopTour () {
      this.stop()
    },
    beforeRoute (to, from, next) {
      // When running a tour, each called route will also be pushed as a tour
      if (this.isRunning) {
        _.merge(to, { query: { tour: true } })
      }
      next()
    }
  },
  mounted () {
    // vue-tour does not allow to override tour methods
    this.getTour().nextTourStep = this.getTour().nextStep
    this.getTour().nextStep = this.nextStep
    this.getTour().previousTourStep = this.getTour().previousStep
    this.getTour().previousStep = this.previousStep

    this.refreshTour()
  },
  created () {
    this.unregisterRouteGuard = this.$router.beforeEach(this.beforeRoute)
    this.$events.$on('tours-current-changed', this.setCurrentTour)
  },
  beforeDestroy () {
    this.unregisterRouteGuard()
    this.$events.$off('tours-current-changed', this.setCurrentTour)
  }
}
</script>

<style lang="stylus" scoped>
  .v-step
    background: $secondary;
    z-index: 10000;
  .v-tour__target--highlighted
    box-shadow: 0 0 0 99999px rgba(0,0,0,.4);
</style>
