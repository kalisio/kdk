<template>
  <!--
    User agent && copy action
  -->
  <div>
    <div class="full-width row justify-between items-center">
      <div class="q-pa-sm col-11 bg-grey-3">{{ $t('KPlatform.USER_AGENT') }}</div>

        <KAction
          id="copy-clipboard"
          icon="las la-copy"
          :handler="copy"
          tooltip="KPlatform.COPY_INFO"
          renderer="fab"
          color="primary"
          class="col-1"
        />
    </div>
    <div class="q-px-md q-py-sm full-width text-caption">{{ Platform.getData().userAgent }}</div>
  </div>
  <!--
    Application
  -->
  <div>
    <div class="full-width q-pa-sm bg-grey-3">{{ $t('KPlatform.APPLICATION') }}</div>
    <q-list class="q-pa-sm" separator dense>
      <template v-for="(value, prop) in applicationProperties()" :key="prop">
        <q-item>
          <q-item-section class="text-caption">{{ prop }}</q-item-section>
          <q-item-section class="text-caption">{{ value === true ? $t('YES') : value === false ? $t('NO') : value }}</q-item-section>
        </q-item>
      </template>
    </q-list>
    <q-expansion-item
      :label="$t('KPlatform.PERMISSIONS')"
      expand-separator
      dense
      header-class="bg-grey-2"
      class="q-pa-sm"
    >
      <q-list class="q-pa-sm" separator dense>
        <template v-for="(value, prop) in Platform.getData().application.permissions" :key="prop">
          <q-item>
            <q-item-section class="text-caption">{{ prop }}</q-item-section>
            <q-item-section class="text-caption">{{ value === 'granted' ? $t('KPlatform.PERMISSION_GRANTED') : $t('KPlatform.PERMISSION_PROMPT') }}</q-item-section>
          </q-item>
        </template>
      </q-list>
  </q-expansion-item>
  </div>
  <!--
    Browser
  -->
  <div>
    <div class="full-width q-pa-sm bg-grey-3">{{ $t('KPlatform.BROWSER') }}</div>
    <q-list class="q-pa-sm" separator dense>
      <template v-for="(value, prop) in browserProperties()" :key="prop">
        <q-item>
          <q-item-section class="text-caption">{{ prop }}</q-item-section>
          <q-item-section class="text-caption">{{ value === true ? $t('YES') : value === false ? $t('NO') : value }}</q-item-section>
        </q-item>
      </template>
    </q-list>
    <q-expansion-item
      :label="$t('KPlatform.LOCALE')"
      expand-separator
      dense
      header-class="bg-grey-2"
      default-opened
      class="q-pa-sm"
    >
      <q-list class="q-pa-sm" separator dense>
        <template v-for="(value, prop) in Platform.getData().browser.locale" :key="prop">
          <q-item>
            <q-item-section class="text-caption">{{ prop }}</q-item-section>
            <q-item-section class="text-caption">{{ value }}</q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-expansion-item>
    <q-expansion-item
      :label="$t('KPlatform.WEBGL')"
      expand-separator
      dense
      header-class="bg-grey-2"
      class="q-pa-sm"
    >
      <q-list class="q-pa-sm" separator dense>
        <template v-for="(value, prop) in Platform.getData().browser.webgl" :key="prop">
          <q-item>
            <q-item-section class="text-caption">{{ prop }}</q-item-section>
            <q-item-section class="text-caption">{{ value }}</q-item-section>
          </q-item>
        </template>
      </q-list>
    </q-expansion-item>
  </div>
  <!-- System  -->
  <div>
    <div class="full-width q-pa-sm bg-grey-3">{{ $t('KPlatform.SYSTEM') }}</div>
    <q-list class="q-pa-sm" separator dense>
      <template v-for="(value, prop) in systemProperties()" :key="prop">
        <q-item>
          <q-item-section class="text-caption">{{ prop }}</q-item-section>
          <q-item-section class="text-caption">{{ value === true ? $t('YES') : value === false ? $t('NO') : value }}</q-item-section>
        </q-item>
      </template>
    </q-list>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { Notify, copyToClipboard } from 'quasar'
import { i18n } from '../../i18n.js'
import { Platform } from '../../platform.js'
import KAction from '../action/KAction.vue'

// Functions
function applicationProperties () {
  return _.pick(Platform.getData().application, ['mode', 'iframe'])
}
function browserProperties () {
  return _.pick(Platform.getData().browser, ['name', 'version'])
}
function systemProperties () {
  return Platform.getData().system
}
async function copy () {
  try {
    await copyToClipboard(JSON.stringify(Platform.getData(), null, 2))
    Notify.create({ type: 'positive', message: i18n.t('KPlatform.INFO_COPIED') })
  } catch (error) {
    Notify.create({ type: 'negative', message: i18n.t('KPositionIndicator.CANNOT_COPY_INFO') })
  }
}
</script>

<style lang="scss">
// overwrite the default style allow word wrapping
.q-table--no-wrap td {
  white-space: normal;
}
</style>
