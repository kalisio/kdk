<template>
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
    <k-action
      id="capture-button"
      icon="las la-camera"
      tooltip="KCaptureToolbar.CAPTURE_ACTION"
      :handler="() => capture()"
    />
  </div>
</template>

<script setup>
import KAction from '../../../core/client/components/KAction.vue'
import { useCapture } from '../composables/capture.js'

const { width, height, resolution, getResolutions, capture } = useCapture()
</script>