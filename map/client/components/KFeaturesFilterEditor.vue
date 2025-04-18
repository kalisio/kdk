<template>
  <div id="filter-editor" class="column">
    <!--
      Title
    -->
      <div id="filter-editor-header" v-if="title">
      <div class="ellipsis text-h6">
        {{ $tie(title) }}
      </div>
    </div>
    <div
      id="filter-editor-content"
      class="full-width column"
    >
      <!--
        Name editor
      -->
      <KForm
        ref="formRef"
        :values="formValues"
        :schema="formSchema"
      />
      <div id="filter-editor-rule">
        <q-list>
          <q-item v-if="!hasUniqueCondition">
            <q-item-section>{{ $t('KFilterCondition.FILTER_WHEN') }}</q-item-section>
          </q-item>
          <template v-for="(condition, index) in conditions" :key="condition.id">
            <KFilterCondition
              :ref="(el) => conditionsRefs[index] = el"
              :condition="condition"
              :isFirst="index === 0"
              :isUnique="hasUniqueCondition"
              :layerId="layerId"
              :layerName="layerName"
              @onRemove="removeCondition"
            />
          </template>
          <q-item>
            <q-item-section class="row items-center">
              <q-btn
                id="add-condition"
                icon="las la-plus"
                :label="$t('KFeaturesFilterManager.ADD_CONDITION')"
                outline
                rounded
                @click="addCondition"
              />
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <q-select for="filter-style-field" id="filter-style-field"
        v-model="style"
        :options="styleOptions"
        :label="$t('KFeaturesFilterManager.STYLE_LABEL')"
      >
        <!-- Selected display -->
        <template v-slot:selected-item="scope">
          <q-item v-bind="scope.itemProps" class="q-ma-none q-pa-none">
            <q-item-section class="col-auto q-mr-md"><q-item-label>{{ scope.opt.label }}</q-item-label></q-item-section>
            <q-item-section v-if="scope.opt.data">
              <div class="row items-center q-gutter-sm">
                <KStylePreview :style="scope.opt.data.point" type="point" />
                <KStylePreview :style="scope.opt.data.line" type="line" />
                <KStylePreview :style="scope.opt.data.polygon" type="polygon" />
              </div>
            </q-item-section>
          </q-item>
        </template>
        <!-- Options display -->
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section class="col-auto q-mr-md"><q-item-label>{{ scope.opt.label }}</q-item-label></q-item-section>
            <q-item-section v-if="scope.opt.data">
              <div class="row items-center q-gutter-sm">
                <KStylePreview :style="scope.opt.data.point" type="point" />
                <KStylePreview :style="scope.opt.data.line" type="line" />
                <KStylePreview :style="scope.opt.data.polygon" type="polygon" />
              </div>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
      <KStyleEditor
        v-if="style && styleOptions.length > 0 && style.value === styleOptions[1].value"
        ref="styleEditorRef"
        v-model="styleValue"
        class="q-pa-md"
        hideButtons
        @applied="onStyleApplied"
      />
    </div>
    <!--
      Buttons
    -->
    <div id="filter-editor-footer" class="row justify-end q-mt-md" v-if="!hideButtons">
      <KPanel
        id="filter-editor-buttons"
        class="q-gutter-x-sm"
        :content="buttons"
        :action-renderer="'form-button'"
      />
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { uid } from 'quasar'
import { ref, computed, onMounted } from 'vue'
import { api, i18n } from '../../../core/client'
import { filterQueryToConditions } from '../utils'
import KFilterCondition from './KFilterCondition.vue'
import KStyleEditor from './styles/KStyleEditor.vue'
import KStylePreview from './styles/KStylePreview.vue'

// Props
const props = defineProps({
  filter: {
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
  layerId: {
    type: String,
    default: ''
  },
  layerName: {
    type: String,
    default: ''
  }
})

// Emits
const emit = defineEmits(['canceled', 'applied'])

// Data
const formRef = ref(null)
const styleEditorRef = ref(null)
const conditionsRefs = ref([])
let styles = []
const styleOptions = ref(getStyleOptions())
const conditions = ref(getConditions())
const style = ref(null)
let createdStyle = null
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
        label: 'KFeaturesFilterManager.NAME_LABEL'
      }
    }
  },
  required: ['name']
}

// Computed
const formValues = computed(() => {
  if (_.isEmpty(props.filter)) return null
  return { name: _.get(props.filter, 'label') }
})
const styleValue = computed(() => {
  if (_.isEmpty(props.filter)) return null
  return _.get(props.filter, 'style')
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
const hasUniqueCondition = computed(() => {
  return _.compact(conditions.value).length === 1
})

// Functions
async function getStyles () {
  const styles = await api.getService('styles').find()
  return styles.data
}
function getStyleOptions () {
  const options = [{ label: i18n.t('KFeaturesFilterManager.NONE'), value: null }, { label: i18n.t('KFeaturesFilterManager.NEW'), value: '+' }]
  _.forEach(styles, style => {
    options.push({ label: style.name, value: style._id, data: style })
  })
  return options
}
function getConditions () {
  if (_.isEmpty(props.filter)) return [{ id: uid() }]
  return filterQueryToConditions(_.get(props.filter, 'active'))
}
function getStyle () {
  if (_.isEmpty(props.filter)) return styleOptions.value[0]
  const style = _.find(styles, { _id: _.get(props.filter, 'style') })
  if (!style) return styleOptions.value[0]
  return { label: style.name, value: style._id, data: style }
}
function addCondition () {
  conditions.value.push({ id: uid() })
}
function removeCondition (id) {
  conditions.value = _.filter(conditions.value, condition => condition.id !== id)
}
function conditionsToQuery (conditions) {
  const value = { ['properties.' + conditions[0].property]: { ['$' + conditions[0].comparisonOperator]: conditions[0].value } }
  if (conditions.length < 2) return value
  const query = {
    ['$' + conditions[1].booleanOperator]: [
      value,
      conditionsToQuery(conditions.slice(1))
    ]
  }

  return query
}
function onStyleApplied (style) {
  createdStyle = style
}
async function apply () {
  const formResult = formRef.value.validate()
  if (!formResult.isValid) return

  let areConditionsValid = true
  const conditionsValues = []
  _.forEach(conditionsRefs.value, condition => {
    if (!condition) return
    const result = condition.validate()
    if (!result.isValid) {
      areConditionsValid = false
      return
    }
    conditionsValues.push(result.values)
  })

  if (!areConditionsValid) return

  let styleResult = null
  if (style.value.value === styleOptions.value[1].value) {
    // Create a new style
    styleResult = await styleEditorRef.value.apply()
    if (!styleResult) return
  }

  const filter = {
    id: _.get(props.filter, 'id'),
    label: formResult.values.name,
    description: _.join(_.map(conditionsValues, condition => condition.description), ''),
    isActive: true,
    active: conditionsToQuery(conditionsValues),
    inactive: {},
    style: styleResult ? _.get(createdStyle, '_id') : style.value.value
  }

  emit('applied', filter)
  return true
}

onMounted(async () => {
  styles = await getStyles()
  styleOptions.value = getStyleOptions()
  style.value = getStyle()
})

// Expose
defineExpose({
  apply
})

</script>
