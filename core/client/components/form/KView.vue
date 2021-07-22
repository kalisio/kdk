<template>
  <div class="column">
    <!--
      Non-grouped fields
     -->
    <template v-for="field in fields">
      <div v-if="!field.group" :key="field.name" class="row items-center"
        v-bind:class="{ 'k-view-row': separators }"
      >
        <!-- Field label -->
        <span class="col-xs-5 col-sm-4 col-3 text-caption">
          {{ $t(field.field.label) }}
        </span>
        <!-- Field value -->
        <component class="col"
          :is="field.componentKey"
          v-bind="$props"
          :properties="field"
          :readOnly="true" />
      </div>
    </template>
    <!--
      Grouped fields
     -->
    <template v-for="group in groups">
      <q-expansion-item :key="group" icon="las la-file-alt" :group="group" :label="$t(group)">
        <template v-for="field in fields">
          <div v-if="field.group === group" :key="field.group + field.name" class="row items-center"
            v-bind:class="{ 'k-view-row': separators }"
          >
            <!-- Field label -->
            <span class="col-xs-5 col-sm-4 col-3 text-caption">
              {{ $t(field.field.label) }}
            </span>
            <!-- Field value -->
            <component class="col"
              :is="field.componentKey"
              v-bind="$props"
              :properties="field"
              :readOnly="true" />
          </div>
        </template>
      </q-expansion-item>
    </template>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'k-view',
  props: {
    schema: {
      type: Object,
      default: null
    },
    values: {
      type: Object,
      default: null
    },
    separators: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      fields: [],
      groups: []
    }
  },
  watch: {
    schema: function () {
      this.refresh()
    }
  },
  methods: {
    refresh  () {
      // Clear the fields states
      this.fields = []
      this.groups = []
      // Build the fields
      // 1- assign a name corresponding to the key to enable a binding between properties and fields
      // 2- assign a component key corresponding to the component path
      // 3- load the component if not previously loaded
      Object.keys(this.schema.properties).forEach(property => {
        const field = this.schema.properties[property]
        // 1- assign a name corresponding to the key to enable a binding between properties and fields
        field.name = property
        // 2- assign a component key corresponding to the component path
        const componentKey = _.kebabCase(field.field.component)
        field.componentKey = componentKey
        // Adds the field to the list of fields to be rendered
        this.fields.push(field)
        if (field.group && !this.groups.includes(field.group)) this.groups.push(field.group)
        // 3- load the component if not previously loaded
        if (!this.$options.components[componentKey]) {
          this.$options.components[componentKey] = this.$load(field.field.component)
        }
      })
    }
  },
  created () {
    if (this.schema) this.refresh()
  }
}
</script>

<style lang="stylus">
  .k-view-row {
    border-bottom: solid 1px var(--q-color-secondary);
  }
  .k-view-row:hover {
    background: var(--q-color-secondary);
  }
</style>
