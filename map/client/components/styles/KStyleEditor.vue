<template>
  <div id="style-editor-header" v-if="title">
    <div class="ellipsis text-h6">
      {{ $tie(title) }}
    </div>
  </div>
  <div id="style-editor-content" class="row">
    <div class="col-6">
      <q-input v-model="style.name" :label="$t('KStyleEditor.NAME')" />
    </div>
    <div class="col-12 q-mt-md">
      <q-expansion-item header-class="bg-grey-2">
        <template v-slot:header>
          <q-item-section avatar>
            <q-icon name="las la-map-marker" />
          </q-item-section>
          <q-item-section>
            {{ $t('KStyleEditor.SECTION_TITLE_POINT') }}
          </q-item-section>
          <q-item-section side>
            <KStylePreview type="point" :options="style" />
          </q-item-section>
        </template>
        <q-list class="q-ml-md">
          <KStyleProperty v-model="style.point.color" :name="$t('KStyleEditor.COLOR')" type="color" />
          <KStyleProperty v-model="style.point.size" :name="$t('KStyleEditor.SIZE')" type="size" />
          <KStyleProperty v-model="style.point.shape" :name="$t('KStyleEditor.SHAPE')" type="shape" />
          <KStyleProperty v-if="!is3D" v-model="style.point.icon.classes" :name="$t('KStyleEditor.ICON')" type="icon" />
          <KStyleProperty v-if="!is3D" v-model="style.point.icon.size" :name="$t('KStyleEditor.ICON_SIZE')" type="size" :min="12" :max="24" />
        </q-list>
      </q-expansion-item>

      <q-expansion-item header-class="bg-grey-2">
        <template v-slot:header>
          <q-item-section avatar>
            <q-icon name="las la-chart-line" />
          </q-item-section>
          <q-item-section>
            {{ $t('KStyleEditor.SECTION_TITLE_LINE') }}
          </q-item-section>
          <q-item-section side>
            <KStylePreview type="line" :options="style"/>
          </q-item-section>
        </template>
        <q-list class="q-ml-md">
          <KStyleProperty v-model="style.line.color" :name="$t('KStyleEditor.COLOR')" type="color" />
          <KStyleProperty v-model="style.line.width" :name="$t('KStyleEditor.SIZE')" type="size" :min="1" :max="12"/>
          <KStyleProperty v-model="style.line.opacity" :name="$t('KStyleEditor.OPACITY')" type="opacity" />
        </q-list>
      </q-expansion-item>

      <q-expansion-item header-class="bg-grey-2">
        <template v-slot:header>
          <q-item-section avatar>
            <q-icon name="las la-draw-polygon" />
          </q-item-section>
          <q-item-section>
            {{ $t('KStyleEditor.SECTION_TITLE_POLYGON') }}
          </q-item-section>
          <q-item-section side>
            <KStylePreview type="polygon" :options="style" />
          </q-item-section>
        </template>
        <q-list class="q-ml-md">
          <KStyleProperty v-model="style.polygon.color" :name="$t('KStyleEditor.FILL_COLOR')" type="color" />
          <KStyleProperty v-model="style.polygon.opacity" :name="$t('KStyleEditor.FILL_OPACITY')" type="opacity" />
          <KStyleProperty v-model="style.polygon.stroke.color" :name="$t('KStyleEditor.STROKE_COLOR')" type="color" />
          <KStyleProperty v-model="style.polygon.stroke.width" :name="$t('KStyleEditor.STROKE_WIDTH')" type="size" icon="las la-stop" :min="1" :max="12" />
          <KStyleProperty v-model="style.polygon.stroke.opacity" :name="$t('KStyleEditor.STROKE_OPACITY')" type="opacity" icon="las la-border-style" />
        </q-list>
      </q-expansion-item>
    </div>
  </div>
  <div id="style-editor-footer" class="row justify-end q-mt-md" v-if="!hideButtons">
    <KPanel
      id="style-editor-buttons"
      class="q-gutter-x-sm"
      :content="buttons"
      :action-renderer="'form-button'"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import _ from 'lodash'
import KStyleProperty from './KStyleProperty.vue'
import KStylePreview from './KStylePreview.vue'
import KPanel from '../../../../core/client/components/KPanel.vue'
import { DefaultStyle } from '../../utils/index.js'
import { useCurrentActivity } from '../../composables/activity.js'

// Props
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  hideButtons: {
    type: Boolean,
    default: false
  },
  buttons: {
    type: Array,
    default: null
  },
  style: {
    type: Object,
    default: _.pick(DefaultStyle, ['point', 'line', 'polygon'])
  }
})

// Emits
const emit = defineEmits([
  'cancel',
  'apply'
])

// Data
const style = ref(_.assign({}, _.cloneDeep(_.pick(DefaultStyle, ['point', 'line', 'polygon']), { name: '' }, props.style)))
const { CurrentActivity } = useCurrentActivity()

// Computed
const buttons = computed(() => {
  if (props.buttons !== null) return props.buttons
  return [
    {
      id: 'close-button',
      label: 'CANCEL',
      renderer: 'form-button',
      outline: true,
      handler: () => {
        emit('cancel')
      }
    },
    {
      id: 'apply-button',
      label: 'APPLY',
      renderer: 'form-button',
      handler: () => {
        emit('apply', style.value)
      }
    }
  ]
})
const is3D = computed(() => {
  return CurrentActivity.value.is3D()
})

// Functions
function getStyle () {
  return style.value
}

defineExpose({
  getStyle
})

</script>
