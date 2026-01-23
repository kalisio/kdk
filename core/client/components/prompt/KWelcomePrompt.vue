<template>
  <q-dialog persistent ref="dialogRef">
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
          <div :class="dense ? 'text-weight-medium' : 'text-h6'">{{ $t('KWelcomePrompt.WELCOME_TITLE') }}</div>
          <div>{{ $t('KWelcomePrompt.WELCOME_MESSAGE') }}</div>
          <div>{{ $t('KWelcomePrompt.ONLINE_HELP') }}
            <q-icon size="1.5em" class="text-primary cursor-pointer" name="las la-external-link-square-alt" @click="onOnlineHelp()"/>
          </div>
        </q-carousel-slide>
        <q-carousel-slide
          name="tour"
          class="column no-wrap justify-center text-center q-gutter-sm"
        >
          <div>{{ $t('KWelcomePrompt.TOUR_MESSAGE') }}
            <q-icon size="1.5em" class="text-primary cursor-pointer" name="las la-external-link-square-alt" @click="onDefaultTour()"/>
          </div>
          <div>{{ $t('KWelcomePrompt.TOUR_LINK_MESSAGE') }}</div>
        </q-carousel-slide>
        <q-carousel-slide
          name="goodbye"
          class="column no-wrap justify-center text-center q-gutter-sm"
        >
          <div>
            <span>
              {{ $t('KWelcomePrompt.CONTEXTUAL_HELP') }}
              <q-icon size="1.5em" class="text-primary cursor-pointer" name="las la-question-circle"/>
            </span>
          </div>
          <div>{{ $t('KWelcomePrompt.GOODBYE_MESSAGE') }}</div>
        </q-carousel-slide>
      </q-carousel>
      <div :class="dense ? 'q-py-xs' : 'q-py-md'">
        <KAction
          id="close-button"
          label="CLOSE"
          renderer="form-button"
          :handler="() => onDialogCancel()"
        />
      </div>
      <q-checkbox
        v-model="toggle"
        :label="$t('KWelcomePrompt.HIDE_WELCOME')"
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
import { ref, computed } from 'vue'
import { openURL, useQuasar, useDialogPluginComponent } from 'quasar'
import { Store } from '../..'
import { loadComponent } from '../../utils'
import { LocalStorage } from '../../local-storage.js'
import KAction from '../action/KAction.vue'

// Data
const $q = useQuasar()
const logoComponent = ref(loadComponent(_.get(config, 'logoComponent', 'KLogo')))
const defaultTour = _.get(config, 'welcome.tour', 'home')
const currentSlide = ref('welcome')
const toggle = ref(false)
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent()

// Computed
const dense = computed(() => {
  return $q.screen.lt.sm
})

// functions
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
  onDialogCancel()
  Store.patch('tours.current', { name: defaultTour })
}
</script>
