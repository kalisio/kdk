<template>
  <q-item dense>
    <q-item-section :class="isUnique ? 'col-auto' : 'col-1'">
      <q-select
        v-if="!isFirst"
        ref="booleanOperatorRef"
        v-model="booleanOperator"
        :options="booleanOperators"
        :label="$t('KFilterCondition.BOOLEAN_OPERATOR')"
        :error="hasBooleanOperatorErrors"
        :error-message="$t('KFilterCondition.CANNOT_BE_EMPTY')"
        @update:model-value="checkBooleanOperatorValidity"
        emit-value map-options dense
        id="condition-boolean"
      />
      <div v-else-if="isUnique">{{ $t('KFilterCondition.FILTER_WHEN') }}</div>
    </q-item-section>
    <q-item-section class="col-auto items-center">
      {{ $t('KFilterCondition.PROPERTY') }}
    </q-item-section>
    <q-item-section class="">
      <q-select
        v-model="property"
        ref="propertyRef"
        :options="properties"
        :label="$t('KFilterCondition.PROPERTY_NAME')"
        :error="hasPropertyErrors"
        :error-message="$t('KFilterCondition.CANNOT_BE_EMPTY')"
        @update:model-value="onPropertyChange"
        emit-value map-options dense
        id="condition-property"
      />
    </q-item-section>
    <q-item-section class="col-auto items-center">
      {{ $t('KFilterCondition.IS') }}
    </q-item-section>
    <q-item-section class="col-2">
      <q-select
        v-model="comparisonOperator"
        :options="filteredComparisonOperators"
        :label="$t('KFilterCondition.COMPARISON_OPERATOR')"
        :error="hasComparisonOperatorErrors"
        :error-message="$t('KFilterCondition.CANNOT_BE_EMPTY')"
        @update:model-value="onComparisonOperatorChange"
        emit-value map-options dense
        id="condition-comparison"
      />
    </q-item-section>
    <q-item-section>
      <q-select
        v-if="valueOptions"
        v-model="value"
        :multiple="useMultipleValuesSelect"
        :use-chips="useMultipleValuesSelect"
        :options="valueOptions"
        :label="$t('KFilterCondition.VALUE')"
        :error="hasValueErrors"
        :error-message="$t('KFilterCondition.CANNOT_BE_EMPTY')"
        @update:model-value="checkValueValidity"
        emit-value map-options dense
        id="condition-value"
      />
      <q-input
        v-else
        v-model="value"
        :type="valueIsNumber ? 'number' : 'text'"
        :label="$t('KFilterCondition.VALUE')"
        :error="hasValueErrors"
        :error-message="$t('KFilterCondition.CANNOT_BE_EMPTY')"
        @update:model-value="checkValueValidity"
        dense
        id="condition-value"
      />
    </q-item-section>
    <q-item-section class="col-1 items-center" v-if="!isUnique">
      <KPanel
        v-if="!isFirst"
        :content="panelContent"
      />
    </q-item-section>
  </q-item>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed, onMounted } from 'vue'
import { api, i18n } from '../../../core/client'
import { useCurrentActivity } from '../composables'

// Props
const props = defineProps({
  condition: {
    type: Object,
    default: {}
  },
  isFirst: {
    type: Boolean,
    default: false
  },
  isUnique: {
    type: Boolean,
    default: false
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
const emit = defineEmits(['onRemove', 'onApplied'])

// Data
const panelContent = [{
  id: 'remove-condition',
  icon: 'las la-trash',
  tooltip: 'KFeaturesFilterManager.REMOVE',
  handler: () => onRemove()
}]
const booleanOperators = [
  { label: i18n.t('KFilterCondition.OR'), value: 'or' },
  { label: i18n.t('KFilterCondition.AND'), value: 'and' }
]
const comparisonOperators = [
  { label: i18n.t('KFilterCondition.IN'), value: 'in', type: 'array' },
  { label: i18n.t('KFilterCondition.NOT_IN'), value: 'nin', type: 'array' },
  { label: i18n.t('KFilterCondition.EQUAL'), value: 'eq' },
  { label: i18n.t('KFilterCondition.NOT_EQUAL'), value: 'ne' },
  { label: i18n.t('KFilterCondition.GREATER'), value: 'gt' },
  { label: i18n.t('KFilterCondition.GREATER_OR_EQUAL'), value: 'gte' },
  { label: i18n.t('KFilterCondition.LESS'), value: 'lt' },
  { label: i18n.t('KFilterCondition.LESS_OR_EQUAL'), value: 'lte' }
]
const { CurrentActivity } = useCurrentActivity()
let layer = null
const properties = ref([])
const booleanOperator = ref(_.get(props.condition, 'booleanOperator', null))
const property = ref(_.get(props.condition, 'property', null))
const comparisonOperator = ref(_.get(props.condition, 'comparisonOperator', null))
const value = ref(_.get(props.condition, 'value', null))
const valueOptions = ref(null)
const valueIsNumber = ref(false)

const hasBooleanOperatorErrors = ref(false)
const hasPropertyErrors = ref(false)
const hasComparisonOperatorErrors = ref(false)
const hasValueErrors = ref(false)

// Computed
const filteredComparisonOperators = computed(() => {
  return valueIsNumber.value ? _.filter(comparisonOperators, op => _.get(op, 'type') !== 'array') : comparisonOperators
})
const useMultipleValuesSelect = computed(() => {
  const operator = _.find(comparisonOperators, { value: comparisonOperator.value })
  return operator && _.get(operator, 'type') === 'array'
})

// Functions
async function getLayer () {
  if (props.layerName) {
    return CurrentActivity.value.getLayerByName(props.layerName)
  } else {
    return await api.getService('catalog').get(props.layerId)
  }
}
function getProperties () {
  const properties = []
  _.forOwn(_.get(layer, 'schema.content.properties', {}), (value, key) => {
    // Use label or ID
    properties.push({
      label: _.get(value, 'field.label', key),
      value: key
    })
  })
  return properties
}
async function onPropertyChange (property) {
  if (!property) return null
  // Use input of type number if the component from schema is KNumberField
  if (_.get(layer, ['schema', 'content', 'properties', property, 'field', 'component']) === 'form/KNumberField') {
    valueOptions.value = null
    valueIsNumber.value = true
    // Switch comparison operator if not in operators that can be applied to numbers
    if (comparisonOperator.value && !_.find(filteredComparisonOperators.value, { value: comparisonOperator.value })) {
      comparisonOperator.value = filteredComparisonOperators.value[0].value
    }
    return
  }

  // If layer isn't backed by some feathers service, dont' bother querying the list
  // of allowed values.
  if (layer.service) {
    const options = await api.getService(_.get(layer, 'service'))
      .find({ query: Object.assign({ $distinct: `properties.${property}` }, _.get(layer, 'baseQuery')) })

    // Filter values that are not in the new options
    if (value.value && !_.isArray(value.value)) {
      value.value = options.includes(value.value) ? value.value : null
    } else if (value.value && _.isArray(value.value)) {
      value.value = _.filter(value.value, v => options.includes(v))
    }

    valueOptions.value = options.sort()
  } else {
    valueOptions.value = null
  }

  valueIsNumber.value = false

  checkPropertyValidity(property)
}
function onComparisonOperatorChange (operator) {
  const currentValue = value.value
  if (_.get(_.find(comparisonOperators, { value: operator }), 'type') === 'array') {
    value.value = currentValue ? _.isArray(currentValue) ? currentValue : [currentValue] : []
  } else {
    value.value = currentValue ? (_.isArray(currentValue) && currentValue.length) ? currentValue[0] : currentValue : ''
  }

  checkComparisonOperatorValidity(operator)
}
function checkBooleanOperatorValidity (value) {
  if (props.isFirst || (value && _.find(booleanOperators, { value }))) {
    hasBooleanOperatorErrors.value = false
    return true
  }

  hasBooleanOperatorErrors.value = true
  return false
}
function checkPropertyValidity (value) {
  if (value && _.find(properties.value, { value })) {
    hasPropertyErrors.value = false
    return true
  }

  hasPropertyErrors.value = true
  return false
}
function checkComparisonOperatorValidity (value) {
  if (value && _.find(filteredComparisonOperators.value, { value })) {
    hasComparisonOperatorErrors.value = false
    return true
  }

  hasComparisonOperatorErrors.value = true
  return false
}
function checkValueValidity (value) {
  const isDefined = !!value
  // For unique value, check if the value is in the options
  const valueInOptions = !valueOptions.value || !useMultipleValuesSelect.value && valueOptions.value.includes(value)
  // For multiple values, check if all values are in the options
  const valuesInOptions = !valueOptions.value || useMultipleValuesSelect.value && !_.isEmpty(value) && !_.some(value, v => !valueOptions.value.includes(v))
  if (isDefined && (valueInOptions || valuesInOptions)) {
    hasValueErrors.value = false
    return true
  }

  hasValueErrors.value = true
  return false
}
function onRemove () {
  emit('onRemove', _.get(props.condition, 'id'))
}
function generateDescription () {
  let description = ''
  const booleanLabel = _.get(_.find(booleanOperators, { value: booleanOperator.value }), 'label', '')
  const propertyLabel = _.get(_.find(properties.value, { value: property.value }), 'label', '')
  const comparisonLabel = _.get(_.find(filteredComparisonOperators.value, { value: comparisonOperator.value }), 'label', '')
  if (!props.isFirst) description += ` ${booleanLabel} `
  description += `${propertyLabel} ${comparisonLabel} ${_.isArray(value.value) ? value.value.join(', ') : value.value}`
  return description
}
function validate () {
  // Error checks
  const booleanOperatorValid = checkBooleanOperatorValidity(booleanOperator.value)
  const propertyValid = checkPropertyValidity(property.value)
  const comparisonOperatorValid = checkComparisonOperatorValidity(comparisonOperator.value)
  const valueValid = checkValueValidity(value.value)
  if (!booleanOperatorValid || !propertyValid || !comparisonOperatorValid || !valueValid) {
    return { isValid: false, values: null }
  }

  const condition = {
    booleanOperator: props.isFirst ? null : booleanOperator.value,
    property: property.value,
    comparisonOperator: comparisonOperator.value,
    value: value.value,
    description: generateDescription()
  }
  return { isValid: true, values: condition }
}

onMounted(async () => {
  layer = await getLayer()
  properties.value = getProperties()

  await onPropertyChange(property.value)
})

// Expose
defineExpose({
  validate
})
</script>
