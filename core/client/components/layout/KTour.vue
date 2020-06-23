 <template>
  <v-tour name="tour" :steps="tourSteps" :options="tourOptions" :callbacks="tourCallbacks">
    <template slot-scope="tour">
      <transition name="fade">
      <q-card>
        <v-step
          v-if="tour.currentStep === index"
          v-for="(step, index) of tour.steps"
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
          <div slot="actions">
            <q-card-actions v-if="!autoPlay && tourOptions.buttonsEnabled" align="around">
              <q-btn color="primary" text-color="white" outline @click.prevent="tour.skip" v-if="!tour.isLast">{{ tour.labels.buttonSkip }}</q-btn>
              <q-btn color="primary" text-color="white" outline @click.prevent="tour.previousStep" v-if="!tour.isFirst">{{ tour.labels.buttonPrevious }}</q-btn>
              <q-btn color="primary" text-color="white" outline @click.prevent="tour.nextStep" v-if="!tour.isLast">{{ tour.labels.buttonNext }}</q-btn>
              <q-btn color="primary" text-color="white" outline @click.prevent="tour.finish" v-if="tour.isLast">{{ tour.labels.buttonStop }}</q-btn>
            </q-card-actions>
          </div>
        </v-step>
      </q-card>
      </transition>
    </template>
  </v-tour>
</template>

<script>
import { Store } from '../../store'

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
        buttonsEnabled: true,
        autoPlayDelay: 5000
      },
      tourCallbacks: {
        onStart: this.onStartTour,
        onPreviousStep: this.onPreviousTourStep,
        onNextStep: this.onNextTourStep,
        onSkip: this.onSkipTour,
        onFinish: this.onFinishTour
      },
      autoPlay: false
    }
  },
  watch: {
    '$route' (to, from) {
      // React to route changes by loading new tour
      this.refreshTour()
    }
  },
  methods: {
    launchTour (step) {
      this.$tours['tour'].start(step)
      this.autoPlay = false
    },
    playTour (step) {
      this.$tours['tour'].start(step)
      this.autoPlay = true
    },
    refreshTour () {
      const routeName = this.$route.name
      this.tourSteps = Store.get(`tours.${routeName}`, [])
      // Process translations
      this.tourSteps.forEach(step => {
        if (_.has(step, 'title')) _.set(step, 'title', this.$t(_.get(step, 'title')))
        if (_.has(step, 'content')) _.set(step, 'content', this.$t(_.get(step, 'content')))
      })
      const activate = _.get(this.$route, 'query.tour')
      if (activate) {
        const step = _.get(this.$route, 'query.tourStep')
        const play = _.get(this.$route, 'query.play')
        if (play) this.playTour(step)
        else this.launchTour(step)
      }
    },
    autoPlayNextStep () {
      const step = this.tourSteps[_.get(this.$tours, 'tour.currentStep', 0)]
      const delay = _.get(step, 'params.autoPlayDelay', this.tourOptions.autoPlayDelay)
      setTimeout(() => {
        this.$tours['tour'].nextStep()
      }, delay)
    },
    onStartTour () {
      this.$emit('tour-started', { tour: this.tourSteps })
      const delay = _.get(this.$route, 'query.tour')
      if (this.autoPlay) this.autoPlayNextStep()
    },
    onPreviousTourStep (currentStep) {
      this.$emit('tour-previous-step', { tour: this.tourSteps, step: currentStep })
    },
    onNextTourStep (currentStep) {
      this.$emit('tour-next-step', { tour: this.tourSteps, step: currentStep })
      if (this.autoPlay) this.autoPlayNextStep()
    },
    onSkipTour () {
      this.$emit('tour-skipped', { tour: this.tourSteps })
    },
    onFinishTour () {
      this.$emit('tour-finished', { tour: this.tourSteps })
      this.autoPlay = false
    }
  },
  mounted () {
    this.refreshTour()
  }
}
</script>

<style lang="stylus" scoped>
  .v-step
    background: $secondary;
    z-index: 10000;
  
</style>