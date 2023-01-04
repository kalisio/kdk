<template>
  <q-dialog v-model="showWelcome" persistent>
    <q-card class="q-pa-sm column q-gutter-y-md" style="min-width: 50vw">
      <!-- Logo -->
      <component :is="logoComponent" />
      <!-- Carousel -->
      <div class="row justify-center">
        <q-carousel
          class="q-pa-none"
          v-model="currentSlide"
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
        <q-checkbox v-model="toggle" @update:modelValue="onToggleIntroduction" :label="$t('KWelcome.HIDE_WELCOME')" color="primary" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script setup>
import _ from 'lodash'
import config from 'config'
import { ref, onBeforeUnmount } from 'vue'
import { openURL } from 'quasar'
import { Store, api } from '../..'
import { loadComponent } from '../../utils'
import KAction from '../KAction.vue'

// Data
const logoComponent = ref(loadComponent(_.get(config, 'logoComponent', 'KLogo')))
const defaultTour = _.get(config, 'welcome.tour', 'home')
const showWelcome = ref(false)
const currentSlide = ref('welcome')
const toggle = ref(false)

// functions
function getWelcomeKey () {
  return _.get(config, 'appName').toLowerCase() + '-welcome'
}
function show () {
  const canShow = window.localStorage.getItem(getWelcomeKey())
  // Introduction is only for logged users
  showWelcome.value = (_.isNil(canShow) ? _.get(config, 'layout.welcome', true) : JSON.parse(canShow))
}
function hide () {
  showWelcome.value = false
}
function onToggleIntroduction (toggle) {
  window.localStorage.setItem(getWelcomeKey(), JSON.stringify(!toggle))
}
function onOnlineHelp () {
  const onlineHelp = _.get(config, 'appOnlineHelp')
  if (onlineHelp) {
    openURL(onlineHelp)
  } else { // Fallback to default route
    this.$router.push({ name: 'help' })
  }
}
function onDefaultTour () {
  hide()
  Store.patch('tours.current', { name: defaultTour })
}

// hooks
onBeforeUnmount(() => {
  api.off('login', show)
  api.off('logout', hide)
})

// immediate
api.on('login', show)
api.on('logout', hide)
</script>
