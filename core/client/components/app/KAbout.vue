<template>
  <div class="column">
    <!-- Banner -->
    <div class="row justify-center">
      <component :is="logoComponent" />
    </div>
    <!-- Version -->
    <KVersion class="q-pa-sm" />
    <!-- Endpoint -->
    <div class="q-pb-md row justify-center">
      <cite>{{ $t('KAbout.DOMAIN') }}
        <a :href="$config('domain')" target="_blank">{{ $config('domain') }}</a>
      </cite>
      <cite>
        &nbsp;({{ $config('flavor') }})
      </cite>
    </div>
    <!-- Extra content -->
    <div v-if="content" class="q-pl-md q-pr-md q-pt-md">
      <KContent :content="content" />
    </div>
    <!-- Separator -->
    <q-separator />
    <!-- Actions -->
    <KPanel
      id="actions"
      :content="actions"
      class="q-pt-md justify-center"
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
import KContent from '../KContent.vue'
import KVersion from '../KVersion.vue'
import KSponsor from '../KSponsor.vue'
import KPanel from '../KPanel.vue'

// Data
const logoComponent = ref(loadComponent(_.get(config, 'logoComponent', 'KLogo')))
const content = ref(_.get(config, 'about.content', []))
const actions = ref(_.get(config, 'about.actions', []))
</script>
