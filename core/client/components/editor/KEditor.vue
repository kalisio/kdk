<template>
  <div :id="getSchemaId() + 'editor'" class="column justify-center full-width">
    <!--
      Form section
    -->
    <div>
      <k-form :id="getSchemaId() + 'form'" :class="{ 'light-dimmed': applyInProgress }" ref="form" :schema="schema" @field-changed="onFieldChanged"/>
      <q-spinner-cube color="primary" class="fixed-center" v-if="applyInProgress" size="4em"/>
    </div>
    <!--
      Buttons section
    -->
    <div>
      <div class="q-pt-md row justify-end">
        <q-btn v-if="clearButton !== ''" id="clear-button" color="primary" :label="clearButton" @click="clear"/>
        <q-btn v-if="resetButton !== ''" id="reset-button" color="primary" :label="resetButton" @click="reset"/>
        <q-btn v-if="applyButton !== ''" id="apply-button" color="primary" :label="applyButton" @click="apply"/>
      </div>
    </div>
  </div>
</template>

<script>
import { KForm } from '../form'
import mixins from '../../mixins'

export default {
  name: 'k-editor',
  components: {
    KForm
  },
  mixins: [
    mixins.service,
    mixins.objectProxy,
    mixins.schemaProxy,
    mixins.baseEditor(['form']),
    mixins.refsResolver(['form'])
  ],
  watch: {
    '$route' (to, from) {
      // React to route changes but reusing the same component as this one is generic
      this.refresh()
    }
  },
  methods: {
    onFieldChanged (field, value) {
      this.$emit('field-changed', field, value)
    }
  },
  created () {
    this.refresh()
  }
}
</script>
