<template>
  <q-dialog v-model="showWelcome" persistent>
    <q-card class="q-pa-sm" style="min-width: 50vw">
      <div class="row justify-between">
        <img :src="banner">
        <q-btn class="self-start" id="close-action" icon="las la-times" flat round dense @click="hide" />
      </div>
      <q-card-section class="q-pa-none">
        <div class="q-pa-none">

        </div>
        <q-carousel
          class="q-pa-none"
          v-model="slide"
          arrows
          swipeable
          animated
          padding
          vertical
          transition-prev="scale"
          transition-next="scale"
          control-type="flat"
          control-color="primary"
        >
          <q-carousel-slide name="welcome" class="column no-wrap justify-center text-center q-gutter-md">

            <div class="text-h5">{{ $t('KWelcome.WELCOME_TITLE') }}</div>
            <div class="text-subtitle1">{{ $t('KWelcome.WELCOME_MESSAGE') }}</div>
            <div class="text-subtitle1">{{ $t('KWelcome.ONLINE_HELP') }}
              <q-icon size="1.5em" class="text-primary cursor-pointer" name="las la-external-link-square-alt" @click="onOnlineHelp()"/>
            </div>
          </q-carousel-slide>
          <q-carousel-slide name="tour" class="column no-wrap justify-center text-center q-gutter-md">
            <div class="text-subtitle1">{{ $t('KWelcome.TOUR_MESSAGE') }}
              <q-icon size="1.5em" class="text-primary cursor-pointer" name="las la-external-link-square-alt" @click="onDefaultTour()"/>
            </div>
            <div class="text-subtitle1">{{ $t('KWelcome.TOUR_LINK_MESSAGE') }}</div>
          </q-carousel-slide>
          <q-carousel-slide name="goodbye" class="column no-wrap justify-center text-center q-gutter-md">
            <div class="text-subtitle1">
              <span>
                {{ $t('KWelcome.CONTEXTUAL_HELP') }}
                <q-icon size="1.5em" class="text-primary cursor-pointer" name="las la-question-circle"/>
              </span>
            </div>
            <div class="text-subtitle1">{{ $t('KWelcome.GOODBYE_MESSAGE') }}</div>
          </q-carousel-slide>
        </q-carousel>
        <q-checkbox v-model="toggle" @input="onToggleIntroduction" :label="$t('KWelcome.HIDE_WELCOME')" color="primary" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import _ from 'lodash'
import { openURL, QCheckbox, QCarousel, QCarouselSlide, QCarouselControl } from 'quasar'

export default {
  name: 'k-welcome',
  components: {
    QCheckbox,
    QCarousel,
    QCarouselSlide,
    QCarouselControl
  },
  props: {
    defaultTour: {
      type: String,
      default: 'home'
    }
  },
  data () {
    return {
      showWelcome: false,
      slide: 'welcome',
      banner: null,
      toggle: false
    }
  },
  methods: {
    getWelcomeKey () {
      return this.$config('appName').toLowerCase() + '-welcome'
    },
    show () {
      const show = window.localStorage.getItem(this.getWelcomeKey())
      // Introduction is only for logged users
      this.showWelcome = (_.isNil(show) ? true : JSON.parse(show))
    },
    hide () {
      this.showWelcome = false
    },
    onToggleIntroduction (toggle) {
      window.localStorage.setItem(this.getWelcomeKey(), JSON.stringify(!toggle))
    },
    onOnlineHelp () {
      const onlineHelp = this.$config('appOnlineHelp')
      if (onlineHelp) {
        openURL(onlineHelp)
      } else { // Fallback to default route
        this.$router.push({ name: 'help' })
      }
    },
    onDefaultTour () {
      this.hide()
      this.$store.patch('tours.current', { name: this.defaultTour })
    }
  },
  created () {
    // Load required assets
    this.banner = this.$load(this.$config('screens.banner'), 'asset')
  },
  mounted () {
    // Introduction is only for logged users, listen for user login/logout
    this.$api.on('authenticated', this.show)
    this.$api.on('logout', this.hide)
  },
  beforeDestroy () {
    this.$api.off('authenticated', this.show)
    this.$api.off('logout', this.hide)
  }
}
</script>
