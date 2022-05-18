<template>
  <q-dialog v-model="showWelcome" persistent>
    <q-card class="q-pa-sm column q-gutter-y-md" style="min-width: 50vw">
      <div class="row justify-center">
        <img :src="banner">
      </div>
      <div class="row justify-center">
        <q-carousel
          class="q-pa-none"
          v-model="slide"
          swipeable
          animated
          padding
          navigation
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
      </div>
      <div class="row justify-center">
        <k-action id="close-button" label="CLOSE" renderer="form-button" :handler="() => this.hide()" />
      </div>
      <div class="row justify-center">
        <q-checkbox v-model="toggle" @input="onToggleIntroduction" :label="$t('KWelcome.HIDE_WELCOME')" color="primary" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import _ from 'lodash'
import { openURL } from 'quasar'
import KAction from '../frame/KAction.vue'

export default {
  components: {
    KAction
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
      banner: undefined,
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
      this.showWelcome = (_.isNil(show) ? this.$config('layout.welcome', true) : JSON.parse(show))
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
    this.banner = this.$config('screens.banner')
  },
  mounted () {
    // Introduction is only for logged users, listen for user login/logout
    this.$api.on('authenticated', this.show)
    this.$api.on('logout', this.hide)
  },
  beforeUnmount () {
    this.$api.off('authenticated', this.show)
    this.$api.off('logout', this.hide)
  }
}
</script>
