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
              <q-icon class="cursor-pointer" size="1.5rem" name="las la-external-link-square-alt" @click="openRoute()"/>
            </q-card-section>
          </div>
          <div slot="actions" class="row justify-center">
            <q-card-actions align="right">
              <q-btn v-if="hasPreviousButton(step)" id="previous-step-tour" icon="las la-chevron-left" color="primary" text-color="white" dense outline @click.prevent="previousStep"></q-btn>
              <q-btn v-if="hasSkipButton(step)" id="skip-tour" icon="las la-times" color="primary" text-color="white" dense outline @click.prevent="tour.skip"></q-btn>
              <q-btn  v-if="hasFinishButton(step)" id="finish-tour" icon="las la-times" color="primary" text-color="white" dense outline @click.prevent="tour.finish"></q-btn>
              <q-btn v-if="hasLinkButton(step)" icon="las la-link" dense outline text-color="white" @click="openRoute()" />
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
        if (_.has(step, 'link')) _.set(step, 'link', this.$t(_.get(step, 'link')))
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
        if (!this.getTour().isLast) this.nextStep()
        else this.getTour().stop()
      }, delay)
    },
    getTarget (target) {
      const brackets = new RegExp(/\[(.*?)\]/, 'i')
      // Check if there is an array notation like '#action[1]'
      // This is useful for id conflict resolution
      const result = brackets.exec(target)
      if (result) {
        target = target.replace(result[0], '')
        return document.querySelectorAll(target)[_.toNumber(result[1])]
      }
      else return document.querySelector(target)
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
    clickOnNext () {
      const step = this.getStep()
      let targets = _.get(step, 'params.clickOnNext')
      if (targets) {
        if (!Array.isArray(targets)) targets = [targets]
        targets.forEach(target => {
          target = this.getTarget(target)
          if (target) target.click()
        })
      }
    },
    clickOnPrevious () {
      const step = this.getStep()
      let targets = _.get(step, 'params.clickOnPrevious')
      if (targets) {
        if (!Array.isArray(targets)) targets = [targets]
        targets.forEach(target => {
          target = this.getTarget(target)
          if (target) target.click()
        })
      }
    },
    openRouteOnNext () {
      const step = this.getStep()
      if (_.has(step, 'params.routeOnNext')) {
        this.$router.push(_.merge({ query: { tour: true } }, _.get(step, 'params.routeOnNext')))
      }
    },
    openRouteOnPrevious () {
      const step = this.getStep()
      if (_.has(step, 'params.routeOnPrevious')) {
        this.$router.push(_.merge({ query: { tour: true } }, _.get(step, 'params.routeOnPrevious')))
      }
    },
    nextStep () {
      this.clickOnNext()
      this.openRouteOnNext()
      const step = this.getStep()
      const delay = _.get(step, 'params.nextDelay', 0)
      this.isStepVisible = false
      setTimeout(() => {
        this.getTour().nextTourStep()
        this.isStepVisible = true
      }, _.toNumber(delay))
    },
    previousStep () {
      this.clickOnPrevious()
      this.openRouteOnPrevious()
      const step = this.getStep()
      const delay = _.get(step, 'params.previousDelay', 0)
      this.isStepVisible = false
      setTimeout(() => {
        this.getTour().previousTourStep()
        this.isStepVisible = true
      }, _.toNumber(delay))
    },
    openRoute () {
      const step = this.getStep()
      if (_.has(step, 'params.route')) {
        this.isStepVisible = false
        setTimeout(() => {
          this.$router.push(_.merge({ query: { tour: true } }, _.get(step, 'params.route')))
          this.isStepVisible = true
        }, _.toNumber(_.get(step, 'params.routeDelay', 0)))
      }
    },
    clearRoute () {
      // Remove any param related to tour in route so that we can relaunch the tour
      this.$router.replace({ params: _.omit(this.$route.params, ['tour', 'tourStep', 'play']) }).catch(_ => {})
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
      this.clearRoute()
    },
    onFinishTour () {
      this.$emit('tour-finished', { tour: this.tourSteps })
      if (this.playTimer) {
        clearInterval(this.playTimer)
        this.playTimer = null
        this.autoPlay = false
      }
      this.clearRoute()
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