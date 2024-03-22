<template>
  <div class="column">
    <!-- Banner -->
    <div class="row justify-center">
      <component :is="logoComponent" />
    </div>
    <!-- Version -->
    <KVersion class="q-pa-sm" />
    <!-- Endpoint -->
    <div class="row justify-center">
      <cite>{{ $t('KAbout.DOMAIN') }}
        <a :href="$config('domain')" target="_blank">{{ $config('domain') }}</a>
      </cite>
      <cite>
        &nbsp;({{ $config('flavor') }})
      </cite>
    </div>
    <!-- separator -->
    <div class="q-py-md">
      <q-separator />
    </div>
    <!-- Actions -->
    <KPanel
      id="actions"
      :content="actions"
      class="justify-center"
    />
    <!-- Sponsor -->
    <KSponsor class="q-pt-lg" />
  </div>
</template>

<script setup>
import _ from 'lodash'
import config from 'config'
import { ref } from 'vue'
import { loadComponent } from '../../utils'
import KVersion from '../KVersion.vue'
import KSponsor from '../KSponsor.vue'
import KPanel from '../KPanel.vue'

// Data
const logoComponent = ref(loadComponent(_.get(config, 'logoComponent', 'KLogo')))
const actions = ref(_.get(config, 'about.actions', []))
</script>
