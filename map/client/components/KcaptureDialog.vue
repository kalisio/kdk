<template>
  <q-expansion-item
    :label="$t('KDialogToolbar.RESOLUTION_SETTINGS')"
    group="capture"
    class="bg-grey-2"
    id="resolution-settings"
  >
    <div class="q-pl-sm q-pr-xs row justify-center items-center no-wrap q-gutter-x-xs">
      <q-select
        v-model="resolution"
        :options="getResolutions()"
        dense
        borderless>
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label v-html="scope.opt.label" />
            </q-item-section>
            <q-item-section side>
              <q-item-label caption>{{ scope.opt.description }}</q-item-label>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <q-input
        v-model.number="width"
        type="number"
        min="256" max="4000"
        mask="(#)###"
        borderless
        dense
        input-class="text-center"
        style="max-width: 54px"
      />
      <span>x</span>
      <q-input
        v-model.number="height"
        type="number"
        min="256" max="4000"
        mask="(#)###"
        borderless
        dense
        input-class="text-center"
        style="max-width: 54px"
      />
    </div>
  </q-expansion-item>
  <q-expansion-item
    :label="$t('KDialogToolbar.TITLE_SETTINGS')"
    group="capture"
    class="bg-grey-2"
    id="title-settings"
  >
    <q-card class="q-pa-md">
      <q-toggle 
        v-model="header" 
        :label="$t('KDialogToolbar.TITLE_ACTIVE_FIELD_LABEL')" 
        left-label 
      />
      <q-input
        v-model="title"
        :label="$t('KDialogToolbar.TITLE_FIELD_LABEL')"
        :disable="header ? false : true"
        bottom-slots
      />
    </q-card>
  </q-expansion-item>
  <q-expansion-item
    :label="$t('KDialogToolbar.FOOTER_SETTINGS')"
    group="capture"
    class="bg-grey-2"
    id="footer-settings"
  >
    <q-card class="q-pa-md">
      <q-toggle 
        v-model="footer" 
        :label="$t('KDialogToolbar.FOOTER_ACTIVE_FIELD_LABEL')" 
        left-label 
      />
      <q-input
        v-model="footerContent"
        :label="$t('KDialogToolbar.FOOTER_FIELD_LABEL')"
        :disable="footer ? false : true"
        bottom-slots
      />
    </q-card>
  </q-expansion-item>
  <q-expansion-item
    :label="$t('KDialogToolbar.LEGEND_SETTINGS')"
    group="capture"
    class="bg-grey-2"
    id="legend-settings"
  >
    <q-card class="q-pa-md">
      <q-toggle 
        v-model="legend" 
        :label="$t('KDialogToolbar.LEGEND_ACTIVE_FIELD_LABEL')" 
        left-label 
      />
      <q-select 
        v-model="legendPosition" 
        :label="$t('KDialogToolbar.LEGEND_POSITION_FIELD_LABEL')"
        :options="['right', 'left']"
        :disable="legend ? false: true"
        bottom-slots 
      />
    </q-card>
  </q-expansion-item>
  <q-expansion-item
    :label="$t('KDialogToolbar.COMPASS_SETTINGS')"
    group="capture"
    class="bg-grey-2"
    id="compass-settings"
  >
    <q-card class="q-pa-md">
      <q-toggle 
        v-model="compass" 
        :label="$t('KDialogToolbar.COMPASS_ACTIVE_FIELD_LABEL')" 
        left-label 
      />
      <q-select 
        v-model="compassPosition" 
        :label="$t('KDialogToolbar.COMPASS_POSITION_FIELD_LABEL')"
        :options="['top-right', 'top-left', 'bottom-right', 'bottom-left']"
        :disable="compass ? false: true"
        bottom-slots 
      />
    </q-card>
  </q-expansion-item>
</template>

<script setup>
import { useCapture } from '../composables/capture.js'

const { width, height, resolution, header, title, footer, footerContent, legend, legendPosition, compass, compassPosition, getResolutions, capture } = useCapture()

// Expose
defineExpose({
  capture
})
</script>