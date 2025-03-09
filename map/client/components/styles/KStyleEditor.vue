<template>
  <div id="style-editor" class="column">
    <div id="style-editor-header" v-if="title">
      <div class="ellipsis text-h6">
        {{ $tie(title) }}
      </div>
    </div>
    <div
      id="style-editor-content"
      class="full-width column"
    >
      <!-- Name editor -->
      <KForm
        ref="formRef"
        :values="formValues"
        :schema="formSchema"
        @field-changed="onNameChanged"
      />
      <!-- Point editor -->
      <KStyleEditorSection
        v-if="canEditPoint"
        title="KStyleEditor.SECTION_TITLE_POINT"
        :style="style"
        type="point"
      >
        <KStyleProperty v-model="style.point.color" :name="$t('KStyleEditor.COLOR')" type="color" />
        <KStyleProperty v-model="style.point.size" :name="$t('KStyleEditor.SIZE')" type="size" :min="8" :max="64" />
        <KStyleProperty v-model="style.point.shape" :name="$t('KStyleEditor.SHAPE')" type="shape" />
        <KStyleProperty v-if="!is3D" v-model="style.point.icon.classes" :name="$t('KStyleEditor.ICON')" type="icon" />
        <KStyleProperty v-if="!is3D" v-model="style.point.icon.size" :name="$t('KStyleEditor.ICON_SIZE')" type="size" :min="8" :max="48" />
        <KStyleProperty v-model="style.point.stroke.color" :name="$t('KStyleEditor.STROKE_COLOR')" type="color" />
        <KStyleProperty v-model="style.point.stroke.width" :name="$t('KStyleEditor.STROKE_WIDTH')" type="size" :min="1" :max="12" />
        <KStyleProperty v-model="style.point.stroke.opacity" :name="$t('KStyleEditor.STROKE_OPACITY')" type="opacity" />
      </KStyleEditorSection>
      <!-- Line editor -->
      <KStyleEditorSection
        v-if="canEditLine"
        title="KStyleEditor.SECTION_TITLE_LINE"
        :style="style"
        type="line"
      >
        <KStyleProperty v-model="style.line.color" :name="$t('KStyleEditor.COLOR')" type="color" />
        <KStyleProperty v-model="style.line.width" :name="$t('KStyleEditor.SIZE')" type="size" :min="1" :max="12"/>
        <KStyleProperty v-model="style.line.opacity" :name="$t('KStyleEditor.OPACITY')" type="opacity" />
      </KStyleEditorSection>
      <!-- Polygon editor -->
      <KStyleEditorSection
        v-if="canEditPolygon"
        title="KStyleEditor.SECTION_TITLE_POLYGON"
        :style="style"
        type="polygon"
      >
        <KStyleProperty v-model="style.polygon.color" :name="$t('KStyleEditor.FILL_COLOR')" type="color" />
        <KStyleProperty v-model="style.polygon.opacity" :name="$t('KStyleEditor.FILL_OPACITY')" type="opacity" />
        <KStyleProperty v-model="style.polygon.stroke.color" :name="$t('KStyleEditor.STROKE_COLOR')" type="color" />
        <KStyleProperty v-model="style.polygon.stroke.width" :name="$t('KStyleEditor.STROKE_WIDTH')" type="size" :min="1" :max="12" />
        <KStyleProperty v-model="style.polygon.stroke.opacity" :name="$t('KStyleEditor.STROKE_OPACITY')" type="opacity" />
      </KStyleEditorSection>
    </div>
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
import logger from 'loglevel'
import { ref, computed, watch } from 'vue'
import { api, i18n, utils as kdkCoreUtils } from '@kalisio/kdk/core.client'
import KStyleProperty from './KStyleProperty.vue'
import KPanel from '../../../../core/client/components/KPanel.vue'
import KStyleEditorSection from './KStyleEditorSection.vue'
import { DefaultStyle } from '../../utils/index.js'

// Props
const props = defineProps({
  style: {
    type: Object,
    default: () => null
  },
  default: {
    type: Object,
    default: () => null
  },
  is3D: {
    type: Boolean,
    default: false
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
  allowedStyles: {
    type: Array,
    default: ['point', 'line', 'polygon']
  }
})

// Emits
const emit = defineEmits(['applied', 'canceled'])

// Data
const formRef = ref(null)
const style = ref(null)
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
const canEditPoint = computed(() => props.allowedStyles.includes('point'))
const canEditLine = computed(() => props.allowedStyles.includes('line'))
const canEditPolygon = computed(() => props.allowedStyles.includes('polygon'))

// Watch
watch(() => props.style, (value) => {
  style.value = _.defaultsDeep({}, value, props.default, _.pick(DefaultStyle, ['point', 'line', 'polygon']))
}, { immediate: true })

// Functions
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
  let data
  if (mode === 'creation') {
    data = _.merge(style.value, values)
    logger.debug('[KDK] Create style with values:', data)
    await service.create(data)
  } else {
    data = _.merge(style.value, values)
    logger.debug(`[KDK] Patch style ${style._id} with values:`, data)
    await service.patch(style.value._id, data)
  }
  emit('applied', data)
  return true
}

// Expose
defineExpose({
  apply
})
</script>
