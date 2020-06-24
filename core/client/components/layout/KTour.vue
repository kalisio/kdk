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
            <q-separator color="white" v-if="step.title"/>
          </div>
          <div slot="content" class="text-white">
            <q-card-section class="q-pa-xs q-ma-xs" v-if="step.content">
              <div v-html="step.content"></div>
            </q-card-section>
          </div>
          <div slot="actions" class="row justify-center">
            <q-card-actions align="right">
              <q-btn v-if="hasPreviousButton()" id="previous-step-tour" icon="las la-chevron-left" color="primary" text-color="white" outline @click.prevent="previousStep"></q-btn>
              <q-btn v-if="hasSkipButton()" id="skip-tour" icon="las la-times" color="primary" text-color="white" outline @click.prevent="tour.skip"></q-btn>
              <q-btn  v-if="hasFinishButton()" id="finish-tour" icon="las la-times" color="primary" text-color="white" outline @click.prevent="tour.finish"></q-btn>
              <q-btn v-if="step.params && step.params.route" icon="las la-link" outline text-color="white" @click="openRoute()" />
              <q-btn v-if="hasNextButton()" id="next-step-tour" icon="las la-chevron-right" color="primary" text-color="white" outline @click.prevent="nextStep"></q-btn>
            </q-card-actions>
          </div>
        </v-step>
      </q-card>
    </template>
  </v-tour>
</template>

<script>
import _ from 'lodash'

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
        onFinish: this.onFinishTour
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
    hasPreviousButton () {
      return !this.autoPlay && !this.getTour().isFirst && _.get(this.getStep(), 'params.previousButton', true)
    },
    hasNextButton () {
      return !this.autoPlay && !this.getTour().isLast && _.get(this.getStep(), 'params.nextButton', true)
    },
    hasSkipButton () {
      return !this.getTour().isLast && _.get(this.getStep(), 'params.skipButton', true)
    },
    hasFinishButton () {
      return !this.autoPlay && this.getTour().isLast && _.get(this.getStep(), 'params.finishButton', true)
    },
    getTour () {
      return this.$refs['tour']
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
      })
      if (this.tourSteps.length > 0) {
        if (selected.play) this.playTour(selected.step || 0)
        else this.launchTour(selected.step || 0)
      }
    },
    refreshTour () {
      const name = this.$route.name
      const activate = _.get(this.$route, 'query.tour')
      if (activate) {
        const step = _.get(this.$route, 'query.tourStep')
        const play = _.get(this.$route, 'query.play')
        // Will trigger a refresh
        this.$store.patch('tours.current', { name, step, play })
      }
    },
    autoPlayNextStep () {
      const delay = _.get(this.getStep(), 'params.autoPlayDelay', this.tourOptions.autoPlayDelay)
      this.playTimer = setTimeout(() => {
        if (!this.getTour().isLast) this.getTour().nextStep()
        else this.getTour().stop()
      }, delay)
    },
    clickTarget (step) {
      step = this.getStep(step)
      if (_.has(step, 'params.clickDelay')) {
        const delay = _.get(step, 'params.clickDelay')
        setTimeout(() => {
          const target = document.querySelector(_.get(step, 'params.clickOn', _.get(step, 'target')))
          if (target) target.click()
        }, _.toNumber(delay))
      }
    },
    clickOnNext (step) {
      step = this.getStep(step)
      let targets = _.get(step, 'params.clickOnNext')
      if (targets) {
        if (!Array.isArray(targets)) targets = [targets]
        targets.forEach(target => {
          target = document.querySelector(target)
          if (target) target.click()
        })
      }
    },
    clickOnPrevious (step) {
      step = this.getStep(step)
      let targets = _.get(step, 'params.clickOnPrevious')
      if (targets) {
        if (!Array.isArray(targets)) targets = [targets]
        targets.forEach(target => {
          target = document.querySelector(target)
          if (target) target.click()
        })
      }
    },
    nextStep () {
      this.clickOnNext()
      const step = this.getStep(step)
      const delay = _.get(step, 'params.nextDelay', 0)
      this.isStepVisible = false
      setTimeout(() => {
        this.getTour().nextStep()
        this.isStepVisible = true
      }, _.toNumber(delay))
    },
    previousStep () {
      this.clickOnPrevious()
      const step = this.getStep(step)
      const delay = _.get(step, 'params.previousDelay', 0)
      this.isStepVisible = false
      setTimeout(() => {
        this.getTour().previousStep()
        this.isStepVisible = true
      }, _.toNumber(delay))
    },
    openRoute (step) {
      step = this.getStep(step)
      if (_.has(step, 'params.route')) {
        this.isStepVisible = false
        setTimeout(() => {
          this.$router.push(_.merge({ query: { tour: true } }, _.get(step, 'params.route')))
          this.isStepVisible = true
        }, _.toNumber(_.get(step, 'params.routeDelay', 0)))
      }
    },
    onStartTour () {
      this.$emit('tour-started', { tour: this.tourSteps })
      if (this.autoPlay) this.autoPlayNextStep()
      this.clickTarget()
    },
    onPreviousTourStep (currentStep) {
      this.$emit('tour-previous-step', { tour: this.tourSteps, step: currentStep })
      this.clickTarget(currentStep - 1)
    },
    onNextTourStep (currentStep) {
      this.$emit('tour-next-step', { tour: this.tourSteps, step: currentStep })
      if (this.autoPlay) this.autoPlayNextStep()
      this.clickTarget(currentStep + 1)
    },
    onSkipTour () {
      this.$emit('tour-skipped', { tour: this.tourSteps })
    },
    onFinishTour () {
      this.$emit('tour-finished', { tour: this.tourSteps })
      if (this.playTimer) {
        clearInterval(this.playTimer)
        this.playTimer = null
        this.autoPlay = false
      }
    }
  },
  mounted () {
    this.refreshTour()
  },
  created () {
    this.$events.$on('tours-current-changed', this.setCurrentTour)
  },
  beforeDestroy () {
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