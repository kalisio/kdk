<template>
  <div id="style-editor" class="column">
    <!--
      Title
    -->
    <div id="style-editor-header" v-if="title">
      <div class="ellipsis text-h6">
        {{ $tie(title) }}
      </div>
    </div>
    <div
      id="style-editor-content"
      class="full-width column"
    >
      <!--
        Name editor
      -->
      <KForm
        ref="formRef"
        :values="formValues"
        :schema="formSchema"
        @field-changed="onNameChanged"
      />
      <!--
        Point editor
      -->
      <KStyleEditorSection
        v-if="canEditPoint"
        label="KStyleEditor.POINT_SECTION"
        :style="model"
        type="point"
        :dense="dense"
      >
        <KStyleProperty v-model="model.point.color" :label="'KStyleEditor.COLOR'" type="color" :default="getDefaultValue('point.color')" :dense="dense" />
        <KStyleProperty v-model="model.point.size" :label="'KStyleEditor.SIZE'" type="size" :min="8" :max="64" :default="getDefaultValue('point.size')" :dense="dense" />
        <KStyleProperty v-model="model.point.opacity" :label="'KStyleEditor.OPACITY'" type="opacity" :default="getDefaultValue('point.opacity')" :dense="dense" />
        <KStyleProperty v-model="model.point.shape" :label="'KStyleEditor.SHAPE'" type="shape" :default="getDefaultValue('point.shape')" :dense="dense" />
        <KStylePropertiesGroup
          v-if="!is3D"
          label="KStyleEditor.ICON_GROUP"
          v-model="model.point.icon"
          :properties="pointIconProperties"
          :dense="dense"
        />
        <KStylePropertiesGroup
          label="KStyleEditor.STROKE_GROUP"
          v-model="model.point.stroke"
          :properties="pointStrokeProperties"
          :dense="dense"
        />
      </KStyleEditorSection>
      <!--
        Line editor
      -->
      <KStyleEditorSection
        v-if="canEditLine"
        label="KStyleEditor.LINE_SECTION"
        :style="model"
        type="line"
        :dense="dense"
      >
        <KStyleProperty v-model="model.line.color" label="KStyleEditor.COLOR" type="color" :default="getDefaultValue('line.color')" :dense="dense" />
        <KStyleProperty v-model="model.line.width" label="KStyleEditor.SIZE" type="size" :min="1" :max="16" :default="getDefaultValue('line.width')" :dense="dense" />
        <KStyleProperty v-model="model.line.opacity" label="KStyleEditor.OPACITY" type="opacity" :default="getDefaultValue('line.opacity')" :dense="dense" />
      </KStyleEditorSection>
      <!--
        Polygon editor
      -->
      <KStyleEditorSection
        v-if="canEditPolygon"
        label="KStyleEditor.POLYGON_SECTION"
        :style="model"
        type="polygon"
        :dense="dense"
      >
        <KStyleProperty v-model="model.polygon.color" label="KStyleEditor.FILL_COLOR" type="color" :default="getDefaultValue('polygon.color')" :dense="dense" />
        <KStyleProperty v-model="model.polygon.opacity" label="KStyleEditor.FILL_OPACITY" type="opacity" :default="getDefaultValue('polygon.opacity')" :dense="dense" />
        <KStylePropertiesGroup
          label="KStyleEditor.STROKE_GROUP"
          v-model="model.polygon.stroke"
          :properties="polygonStrokeProperties"
          :dense="dense"
        />
      </KStyleEditorSection>
    </div>
    <!--
      Buttons
    -->
    <div id="style-editor-footer" class="row justify-end q-mt-md" v-if="!hideButtons">
      <KPanel
        id="style-editor-buttons"
        class="q-gutter-x-sm"
        :content="buttons"
        :action-renderer="'form-button'"
      />
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import config from 'config'
import logger from 'loglevel'
import { ref, computed, watch } from 'vue'
import { api, i18n, utils as kdkCoreUtils } from '@kalisio/kdk/core.client'
import { useCurrentActivity } from '../../composables'
import KPanel from '../../../../core/client/components/KPanel.vue'
import KStyleEditorSection from './KStyleEditorSection.vue'
import KStylePropertiesGroup from './KStylePropertiesGroup.vue'
import KStyleProperty from './KStyleProperty.vue'
import { DefaultStyle, updateLayerWithFiltersStyle } from '../../utils/index.js'

// Props
const props = defineProps({
  style: {
    type: Object,
    default: () => null
  },
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
  allowedTypes: {
    type: Array,
    default: ['point', 'line', 'polygon']
  },
  dense: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['applied', 'canceled'])

// Data
const { CurrentActivityContext, CurrentActivity } = useCurrentActivity()
const formRef = ref(null)
const model = ref(null)
const mode = props.style ? 'edition' : 'creation'
const formSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $id: 'http://kalisio.xyz/schemas/style-editor#',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      minLength: 3,
      maxLength: 256,
      field: {
        component: 'form/KTextField',
        label: 'KStyleEditor.NAME_LABEL'
      }
    }
  },
  required: ['name']
}

// Computed
const formValues = computed(() => {
  if (_.isEmpty(props.style)) return null
  return { name: _.get(props.style, 'name') }
})
const engine = computed(() => {
  return _.get(CurrentActivityContext.config, 'engine', _.get(config, 'engines.leaflet'))
})
const is3D = computed(() => {
  return engine.value === 'cesium'
})
const pointStrokeProperties = computed(() => {
  return [
    { name: 'color', label: 'KStyleEditor.STROKE_COLOR', type: 'color', default: getDefaultValue('point.stroke.color') },
    { name: 'width', label: 'KStyleEditor.STROKE_WIDTH', type: 'size', min: 1, max: 16, default: getDefaultValue('point.stroke.width') },
    { name: 'opacity', label: 'KStyleEditor.STROKE_OPACITY', type: 'opacity', default: getDefaultValue('point.stroke.opacity') }
  ]
})
const pointIconProperties = computed(() => {
  return [
    { name: 'classes', label: 'KStyleEditor.ICON', type: 'icon', default: getDefaultValue('point.icon.classes') },
    { name: 'size', label: 'KStyleEditor.ICON_SIZE', type: 'size', min: 8, max: 48, default: getDefaultValue('point.icon.size') },
    { name: 'color', label: 'KStyleEditor.ICON_COLOR', type: 'color', default: getDefaultValue('point.icon.color') },
    { name: 'opacity', label: 'KStyleEditor.ICON_OPACITY', type: 'opacity', default: getDefaultValue('point.icon.opacity') }
  ]
})
const polygonStrokeProperties = computed(() => {
  return [
    { name: 'color', label: 'KStyleEditor.STROKE_COLOR', type: 'color', default: getDefaultValue('polygon.stroke.color') },
    { name: 'width', label: 'KStyleEditor.STROKE_WIDTH', type: 'size', min: 1, max: 16, default: getDefaultValue('polygon.stroke.width') },
    { name: 'opacity', label: 'KStyleEditor.STROKE_OPACITY', type: 'opacity', default: getDefaultValue('polygon.stroke.opacity') }
  ]
})
const buttons = computed(() => {
  if (props.buttons !== null) return props.buttons
  return [
    {
      id: 'close-button',
      label: 'CANCEL',
      renderer: 'form-button',
      outline: true,
      handler: () => emit('canceled')
    },
    {
      id: 'apply-button',
      label: 'APPLY',
      renderer: 'form-button',
      handler: apply
    }
  ]
})
const canEditPoint = computed(() => props.allowedTypes.includes('point'))
const canEditLine = computed(() => props.allowedTypes.includes('line'))
const canEditPolygon = computed(() => props.allowedTypes.includes('polygon'))

// Watch
watch(() => props.style, (value) => {
  if (!value) model.value = _.clone(engine.value.style)
  else model.value = value
}, { immediate: true })

// Functions
function getDefaultValue (path) {
  return _.get(engine.value.style, path, _.get(DefaultStyle, path))
}
const onNameChanged = _.debounce(async (field, value) => {
  if (_.size(value) > 2) await checkName(value)
}, 200)
async function checkName (name) {
  if (mode === 'edition' && name === props.style.name) return true
  const service = api.getService('styles')
  const hasName = await kdkCoreUtils.containsText(service, 'name', name)
  if (!hasName) return true
  formRef.value.getField('name').reference.invalidate(i18n.t('KStyleEditor.STYLE_ALREADY_EXISTS', { style: name }))
  return false
}
async function apply () {
  const { isValid, values } = formRef.value.validate()
  if (!isValid) return false
  const service = api.getService('styles')
  // check to name uniqueness
  const isUnique = await checkName(values.name)
  if (!isUnique) return false
  // create to patch the style
  let data = _.merge(model.value, values)
  if (mode === 'creation') {
    data = _.merge(data, { type: 'style', scope: 'user' })
    logger.debug('[KDK] Create style with values:', data)
    const { _id } = await service.create(data)
    _.set(data, '_id', _id)
  } else {
    logger.debug(`[KDK] Patch style ${model.value._id} with values:`, data)
    await service.patch(model.value._id, data)
  }
  // Update layers with filters that use this style
  const layers = _.filter(CurrentActivity.value?.getLayers ? CurrentActivity.value.getLayers() : [], layer =>
    _.get(layer, 'scope') === 'user' &&
    _.some(_.get(layer, 'filters', []), filter => _.get(filter, 'style') === data._id))
  _.forEach(layers, layer => { updateLayerWithFiltersStyle(layer) })

  emit('applied', data)
  return true
}

// Expose
defineExpose({
  apply
})
</script>
