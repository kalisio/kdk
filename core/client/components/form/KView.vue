<template>
  <div class="column">
    <!--
      Non-grouped fields
     -->
    <template v-for="field in fields" :key="field.name">
      <div
        v-if="!field.group"
         class="row items-center"
        v-bind:class="{ 'k-view-row': separators }"
      >
        <!-- Field label -->
        <span class="col-xs-5 col-sm-4 col-3 text-caption">
          {{ getLabel(field) }}
        </span>
        <!-- Field value -->
        <component class="col"
          :is="field.component"
          v-bind="$props"
          :properties="field"
          :readOnly="true"
        />
      </div>
    </template>
    <!--
      Grouped fields
     -->
    <template v-for="group in groups" :key="group">
      <q-expansion-item icon="las la-file-alt" :group="group" :label="$t(group)">
        <template v-for="field in fields" :key="field.group + field.name">
          <div
            v-if="field.group === group"
            class="row items-center"
            v-bind:class="{ 'k-view-row': separators }"
          >
            <!-- Field label -->
            <span class="col-xs-5 col-sm-4 col-3 text-caption">
              {{ getLabel(field) }}
            </span>
            <!-- Field value -->
            <component class="col"
              :is="field.component"
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
import { loadComponent } from '../../utils.js'

export default {
  props: {
    schema: {
      type: Object,
      default: () => null
    },
    values: {
      type: Object,
      default: () => null
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
    getLabel (field) {
      return this.$tie(_.get(field, 'field.label'))
    },
    async refresh  () {
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
        // 2 - qdds the field to the list of fields to be rendered
        this.fields.push(field)
        if (field.group && !this.groups.includes(field.group)) this.groups.push(field.group)
        // 3- load the component
        field.component = loadComponent(field.field.component)
      })
    }
  },
  created () {
    if (this.schema) this.refresh()
  }
}
</script>

<style lang="scss">
  .k-view-row {
    border-bottom: solid 1px $secondary;
  }
  .k-view-row:hover {
    background: $secondary;
  }
</style>
