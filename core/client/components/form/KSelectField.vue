<template>
  <div v-if="readOnly">
    <q-chip :id="properties.name + '-field'" dense>
      {{ model }}
    </q-chip>
  </div>
  <q-select v-else
    :for="properties.name + '-field'"
    :id="properties.name + '-field'"
    ref="select"
    v-model="model"
    :label="label"
    :multiple="multiple"
    :toggle="toggle"
    :radio="radio"
    :use-chips="chips"
    :options="options"
    emit-value
    map-options
    use-input
    :clearable="clearable"
    :error="hasError"
    :error-message="errorLabel"
    :disable="disabled"
    bottom-slots
    @filter="onFilter"
    @blur="onChanged"
    @update:model-value="onChanged"
  >
    <!-- options display -->
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        :id="getId(scope.opt)"
      >
        <q-item-section>
          <q-item-label>{{ scope.opt.label }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <!-- selected item display -->
    <template v-slot:selected-item="scope">
      <span :class="selectedClass()">
        {{ scope.opt.label }}
      </span>
    </template>
    <!-- Helper -->
    <template v-if="hasHelper" v-slot:append>
      <k-action
        :id="properties.name + '-helper'"
        :label="helperLabel"
        :icon="helperIcon"
        :tooltip="helperTooltip"
        :url="helperUrl"
        :dialog="helperDialog"
        :context="helperContext"
        @dialog-confirmed="onHelperDialogConfirmed"
        color="primary"
      />
    </template>
  </q-select>
</template>

<script>
import _ from 'lodash'
import { makeDiacriticPattern } from '../../../common'
import { baseField } from '../../mixins'

export default {
  mixins: [baseField],
  computed: {
    multiple () {
      return _.get(this.properties, 'multiselect', false)
    },
    clearable () {
      return _.get(this.properties, 'field.clearable', true)
    },
    toggle () {
      return _.get(this.properties, 'field.toggle', false)
    },
    radio () {
      return _.get(this.properties, 'field.radio', false)
    },
    chips () {
      return _.get(this.properties, 'field.chips', false)
    },
    options () {
      let opts = _.map(_.get(this.properties, 'field.options', []), option => {
        const label = this.$tie(_.get(option, 'label', ''))
        return Object.assign({}, option, { label })
      })
      if (this.filter) {
        opts = _.filter(opts, option => {
          const regExp = new RegExp(makeDiacriticPattern(this.filter))
          return regExp.test(option.label.toLowerCase())
        })
      }
      return opts
    }
  },
  data () {
    return {
      filter: null
    }
  },
  watch: {
    options: {
      immediate: true,
      handler (opts) {
        if (_.isEmpty(this.filter) && opts.length === 1 && this.required) {
          this.$nextTick(() => {
            this.model = opts[0].value
          })
        }
      }
    }
  },
  methods: {
    getId (option) {
      let id = option.value
      // Complex object ?
      if (typeof id === 'object') {
        // Extract value property or use label if none
        const valueField = _.get(this.properties, 'field.valueField')
        if (valueField) id = _.get(id, valueField)
        else id = option.label
      } else {
        // Ensure string not eg number
        id = id.toString()
      }
      return _.kebabCase(id)
    },
    emptyModel () {
      if (this.multiple) return []
      return null
    },
    onFilter (pattern, update) {
      if (pattern === '') {
        update(() => {
          this.filter = null
        })
        return
      }
      update(() => {
        this.filter = pattern.toLowerCase()
      })
    },
    selectedClass () {
      return _.get(this.properties, 'field.selectedClass', 'text-weight-regular')
    }
  }
}
</script>
