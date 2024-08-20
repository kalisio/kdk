<template>
  <div class="column">
    <!-- Banner -->
    <div class="row justify-center">
      <KContent :content="banner" />
    </div>
    <!-- Version -->
    <KVersion class="q-pa-sm" />
    <!-- Endpoint -->
    <div class="q-pb-md row justify-center">
      <cite>{{ $t('KAbout.DOMAIN') }}
        <a :href="domain" target="_blank">{{ domain }}</a>
      </cite>
      <cite>
        &nbsp;({{ flavor }})
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
import { api } from '../../api'
import KContent from '../KContent.vue'
import KVersion from '../KVersion.vue'
import KSponsor from '../KSponsor.vue'
import KPanel from '../KPanel.vue'

// Data
const domain = ref(_.get(config, 'domain'))
const flavor = ref(_.get(config, 'flavor'))
const banner = ref(_.get(config, 'about.banner', [{ component: 'KLogo' }]))
const content = ref(_.get(config, 'about.content', []))
const actions = ref(_.get(config, 'about.actions', []))
</script>
