<template>
  <div class="k-screen row justify-center items-center window-height window-width">
    <!--
      Header section
    -->
    <component :is="computedHeaderComponent" class="col-12 self-start" />
    <!--
      Content section
    -->
    <div class="k-screen-content">
      <!-- Frame -->
      <q-card class="k-screen-frame full-width q-pa-sm">
        <!-- logo -->
        <slot name="banner">
          <div class="q-pa-sm row justify-center">
            <component :is="computedLogoComponent" />
          </div>
        </slot>
        <!-- title -->
        <q-card-section v-if="title">
          <slot name="title">
            <div class="text-h6 text-center">{{ $t(title) }}</div>
          </slot>
        </q-card-section>
        <q-card-section>
          <slot />
        </q-card-section>
        <!-- actions -->
        <q-card-section v-if="actions.length > 0">
          <KPanel
            id="frame-actions"
            :content="actions"
            class="q-pa-none justify-center"            
          />
        </q-card-section>
      </q-card>
      <!-- screen global actions -->
      <div class="q-pa-sm row justify-center q-gutter-md">
        <KPanel
          id="screen-actions"
          :content="screenActions"
          class="q-pa-none justify-center"          
        />
      </div>
    </div>
    <!--
      Footer section
      -->
    <component :is="computedFooterComponent" class="col-12 self-end" />
  </div>
</template>

<script setup>
import _ from 'lodash'
import config from 'config'
import { ref, computed } from 'vue'
import KPanel from '../KPanel.vue'
import { loadComponent } from '../../utils/index.js'

// Props
defineProps({
  title: {
    type: String,
    default: undefined
  },
  actions: {
    type: Array,
    default: () => []
  }
})

// Data
const logoComponent = ref(_.get(config, 'logoComponent', 'KLogo'))
const headerComponent = ref(_.get(config, 'screens.headerComponent', 'screen/KScreenHeader'))
const footerComponent = ref(_.get(config, 'screens.footerComponent', 'screen/KScreenFooter'))
const backgroundColor = ref(_.get(config, 'screens.backgroundColor', '#EFEFEF'))
const textColor = ref(_.get(config, 'screens.textColor', 'black'))
const frameBackgroundColor = ref(_.get(config, 'screens.frameBackgroundColor', '#FFFFFF'))
const frameTextColor = ref(_.get(config, 'screens.frameTextColor', 'black'))
const screenActions = ref(_.get(config, 'screens.actions', []))

// Computed
const computedHeaderComponent = computed(() => {
  return loadComponent(headerComponent.value)
})
const computedFooterComponent = computed(() => {
  return loadComponent(footerComponent.value)
})
const computedLogoComponent = computed(() => {
  return loadComponent(logoComponent.value)
})
</script>

<style lang="scss" scoped>
.k-screen {
  background-color: v-bind(backgroundColor);
  color: v-bind(textColor);
}
.k-screen-content {
  min-width: 50%;
}
.k-screen-frame {
  background-color: v-bind(frameBackgroundColor);
  color: v-bind(frameTextColor);
}
</style>
