<template>
  <q-dialog v-model="showWelcome" persistent>
    <q-card class="q-pa-xs column items-center q-gutter-y-xs no-wrap">
      <!-- Logo -->
      <component
        :is="logoComponent"
        :height="dense ? '70px' : '100px'"
      />
      <!-- Carousel -->
      <q-carousel
        v-model="currentSlide"
        swipeable
        animated
        navigation
        transition-prev="scale"
        transition-next="scale"
        control-type="flat"
        control-color="primary"
        height="320px"
      >
        <q-carousel-slide
          name="welcome"
          class="column no-wrap justify-center text-center q-gutter-sm"
        >
          <div :class="dense ? 'text-weight-medium' : 'text-h6'">{{ $t('KWelcome.WELCOME_TITLE') }}</div>
          <div>{{ $t('KWelcome.WELCOME_MESSAGE') }}</div>
          <div>{{ $t('KWelcome.ONLINE_HELP') }}
            <q-icon size="1.5em" class="text-primary cursor-pointer" name="las la-external-link-square-alt" @click="onOnlineHelp()"/>
          </div>
        </q-carousel-slide>
        <q-carousel-slide
          name="tour"
          class="column no-wrap justify-center text-center q-gutter-sm"
        >
          <div>{{ $t('KWelcome.TOUR_MESSAGE') }}
            <q-icon size="1.5em" class="text-primary cursor-pointer" name="las la-external-link-square-alt" @click="onDefaultTour()"/>
          </div>
          <div>{{ $t('KWelcome.TOUR_LINK_MESSAGE') }}</div>
        </q-carousel-slide>
        <q-carousel-slide
          name="goodbye"
          class="column no-wrap justify-center text-center q-gutter-sm"
        >
          <div>
            <span>
              {{ $t('KWelcome.CONTEXTUAL_HELP') }}
              <q-icon size="1.5em" class="text-primary cursor-pointer" name="las la-question-circle"/>
            </span>
          </div>
          <div>{{ $t('KWelcome.GOODBYE_MESSAGE') }}</div>
        </q-carousel-slide>
      </q-carousel>
      <div :class="dense ? 'q-py-xs' : 'q-py-md'">
        <KAction
          id="close-button"
          label="CLOSE"
          renderer="form-button"
          :handler="() => hide()"
        />
      </div>
      <q-checkbox
        v-model="toggle"
        :label="$t('KWelcome.HIDE_WELCOME')"
        color="primary"
        size="xs"
        :dense="dense"
        @update:modelValue="onToggleIntroduction"
        :class="dense ? 'q-pt-xs text-caption' : 'q-pt-md'"
      />
    </q-card>
  </q-dialog>
</template>

<script setup>
import _ from 'lodash'
import config from 'config'
import { ref, computed, onBeforeUnmount } from 'vue'
import { openURL, useQuasar } from 'quasar'
import { Store, api } from '../..'
import { loadComponent } from '../../utils'
import { LocalStorage } from '../../local-storage.js'
import KAction from '../action/KAction.vue'

// Data
const $q = useQuasar()
const logoComponent = ref(loadComponent(_.get(config, 'logoComponent', 'KLogo')))
const defaultTour = _.get(config, 'welcome.tour', 'home')
const showWelcome = ref(false)
const currentSlide = ref('welcome')
const toggle = ref(false)

// Computed
const dense = computed(() => {
  return $q.screen.lt.sm
})

// functions
function show () {
  const canShow = LocalStorage.get('welcome')
  // Introduction is only for logged users
  showWelcome.value = (_.isNil(canShow) ? _.get(config, 'layout.welcome', true) : JSON.parse(canShow))
}
function hide () {
  showWelcome.value = false
}
function onToggleIntroduction (toggle) {
  LocalStorage.set('welcome', !toggle)
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
