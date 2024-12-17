<template>
  <form v-if="schema" class="column">
    <!--
      Non-grouped fields
    -->
    <template v-for="field in fields" :key="field.name">
      <slot :name="'before-' + field.name" />
      <slot :name="field.name">
        <component
          v-if="!field.group"
          :ref="onFieldRefCreated"
          :is="field.component"
          v-bind="$props"
          :required="field.required"
          :properties="field"
          :dense="dense"
          @field-changed="onFieldChanged"
        />
      </slot>
      <slot :name="'after-' + field.name" />
    </template>
    <!--
      Grouped fields
    -->
    <template v-for="(group, id) in groups" :key="id">
      <q-expansion-item v-show="group.hasFields" icon="las la-file-alt" :group="id" :id="id">
        <template v-slot:header>
          <!-- Label -->
          <q-item-section>
            {{ $t(group.label) }}
          </q-item-section>
          <!-- Helper -->
          <q-item-section v-if="group.helper" side >
            <k-action
              :id="id + '-helper'"
              color="primary"
              :propagate="false"
              :icon="getHelperIcon(group.helper)"
              :tooltip="getHelperTooltip(group.helper)"
              :url="getHelperUrl(group.helper)"
              :dialog="getHelperDialog(group.helper)"
            />
          </q-item-section>
        </template>
        <!-- Content -->
        <q-card>
          <q-card-section>
            <template v-for="field in fields" :key="field.name">
              <slot v-if="field.group === id" :name="'before-' + field.name"/>
              <slot v-if="field.group === id" :name="field.name">
                <component
                  :ref="onFieldRefCreated"
                  :is="field.component"
                  :required="field.required"
                  v-bind="$props"
                  :properties="field"
                  :dense="dense"
                  @field-changed="onFieldChanged" />
              </slot>
              <slot v-if="field.group === id" :name="'after-' + field.name"/>
            </template>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </template>
  </form>
</template>

<script setup>
import _ from 'lodash'
import logger from 'loglevel'
import { ref, watch, computed, onMounted } from 'vue'
import { loadComponent } from '../../utils/index.js'
import { useSchema } from '../../composables'

// Props
const props = defineProps({
  values: {
    type: Object,
    default: () => null
  },
  schema: {
    type: [String, Object],
    default: () => null
  },
  filter: {
    type: [String, Array],
    default: () => null
  },
  dense: {
    type: Boolean,
    default: false
  }
})

// Emit
const emit = defineEmits(['field-changed', 'form-ready'])

// Data
const { schema, compile: compileSchema, validate: validateSchema } = useSchema()
const fields = ref([])
const isReady = ref(false)
const nbReadyFields = ref(0)
let buildInProgress = false

// Computed
const groups = computed(() => {
  if (schema.value && schema.value.groups) {
    return _.mapValues(schema.value.groups, (group, id) => Object.assign({
      hasFields: _.find(fields.value, { group: id })
    }, group))
  }
  return {}
})

// Watch
watch(() => props.schema, async (value) => {
  logger.debug('[KDK] Schema content changed', value)
  if (value) await build()
})
watch(() => props.filter, async (value) => {
  logger.debug('[KDK] Schema filter changed', value)
  if (value) await build()
})

// Functions
function getField (name) {
  const field = _.find(fields.value, { name })
  if (field) return field
  logger.error(`[KDK] Cannot find field ${name}`)
}
function onFieldRefCreated (reference) {
  if (reference) {
    const name = reference.properties.name
    const field = getField(name)
    if (field.reference) return
    // Assign the reference
    field.reference = reference
    // clear this field
    if (!props.values) field.reference.clear()
    // Check whether the form is ready
    nbReadyFields.value++
    if (nbReadyFields.value === fields.value.length) {
      logger.debug(`[KDK] schema ${schema.value.$id} ready`)
      isReady.value = true
      emit('form-ready')
    }
  }
}
function onFieldChanged (field, value) {
  emit('field-changed', field, value)
  const { isValid, errors } = validateSchema(values())
  if (!isValid) {
    // Checks whether the touched field has an error
    const error = hasFieldError(field, errors)
    if (error) {
      // Invalidate the field
      getField(field).reference.invalidate(error.message)
      return
    }
  }
  // Validate the field
  getField(field).reference.validate()
}
function hasFieldError (field, errors) {
  for (let i = 0; i < errors.length; i++) {
    const error = errors[i]
    // Check whether the field is required
    if (error.keyword === 'required') {
      if (error.params.missingProperty === field) return error
    } else {
      // Check whether the field in invalid
      const fieldDataPath = '/' + field
      if (error.instancePath === fieldDataPath) return error
    }
  }
  return null
}
async function build () {
  fields.value = []
  nbReadyFields.value = 0
  isReady.value = false
  if (!props.schema) throw new Error('Cannot build the form without schema')
  // As we have some async operations here and build() can be trigerred async
  // from different places (watch, mount, ...) we flag it to avoid reentrance
  buildInProgress = true
  // Compile the schema
  await compileSchema(props.schema, props.filter)
  // Build the fields
  _.forOwn(schema.value.properties, (field, property) => {
    // clone and configure the field
    const cloneField = _.clone(field)
    cloneField.name = property // assign a name to allow binding between properties and fields
    let component = _.get(field.field, 'component', '')
    if (!component) {
      // Provide a default component based on schema value type when none is specified
      if (field.type === 'number' || field.type === 'integer') { component = 'form/KNumberField' } else if (field.type === 'boolean') { component = 'form/KToggleField' } else if (field.type === 'string') { component = 'form/KTextField' }
    }
    cloneField.component = loadComponent(component)
    cloneField.reference = null // will be set once te field is rendered
    cloneField.required = _.includes(schema.value.required, property) // add extra required info
    // add the field to the list of fields to be rendered
    fields.value.push(cloneField)
  })
  buildInProgress = false
}
function values () {
  const values = {}
  _.forEach(fields.value, field => {
    if (!field.reference.isEmpty()) values[field.name] = field.reference.value()
  })
  return values
}
function fill (values) {
  if (!isReady.value) throw new Error('Cannot fill the form while not ready')
  logger.debug('[KDK] Filling form', schema.value.$id, values)
  _.forEach(fields.value, field => {
    if (_.has(values, field.name)) {
      getField(field.name).reference.fill(_.get(values, field.name), values)
    } else {
      // The field has no value, then assign a default one
      getField(field.name).reference.clear()
    }
  })
}
function clear () {
  if (!isReady.value) throw new Error('Cannot clear the form while not ready')
  logger.debug('[KDK] Clearing form', schema.value.$id)
  _.forEach(fields.value, field => field.reference.clear())
}
function validate () {
  if (!isReady.value) throw new Error('Cannot validate the form while not ready')
  logger.debug('[KDK] Validating form', schema.value.$id)
  const fieldValues = values()
  const { isValid, errors } = validateSchema(fieldValues)
  if (!isValid) {
    _.forEach(fields.value, field => {
      const error = hasFieldError(field.name, errors)
      if (error) {
        field.reference.invalidate(error.message)
      } else {
        field.reference.validate()
      }
    })
    return { isValid, values: fieldValues }
  }
  _.forEach(fields.value, field => field.reference.validate())
  return { isValid, values: fieldValues }
}
async function apply (object) {
  if (!isReady.value) throw new Error('[KDK] Cannot apply the form while not ready')
  for (let i = 0; i < fields.value.length; i++) {
    const field = fields.value[i]
    await field.reference.apply(object, field.name)
  }
}
async function submitted (object) {
  if (!isReady.value) throw new Error('[KDK] Cannot run submitted on the form while not ready')
  for (let i = 0; i < fields.value.length; i++) {
    const field = fields.value[i]
    await field.reference.submitted(object, field.name)
  }
}
function getHelperIcon (helper) {
  return _.get(helper, 'icon', undefined)
}
function getHelperTooltip (helper) {
  return _.get(helper, 'tooltip', '')
}
function getHelperUrl (helper) {
  return _.get(helper, 'url', null)
}
function getHelperDialog (helper) {
  return _.get(helper, 'dialog', null)
}

// Hooks
onMounted(async () => {
  if (props.schema && !buildInProgress) {
    await build()
  }
})

// Expose
defineExpose({
  getField,
  fill,
  clear,
  values,
  validate,
  apply,
  submitted
})
</script>
