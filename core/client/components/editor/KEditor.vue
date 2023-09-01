<template>
  <div :id="getSchemaId() + 'editor'" class="column justify-center full-width">
    <!--
      Form section
    -->
    <div>
      <KForm
        :id="getSchemaId() + 'form'"
        :ref="onFormReferenceCreated"
        :schema="schema"
        @form-ready="onFormReady"
        class="q-pa-sm"
      />
    </div>
    <!--
      Buttons section
    -->
    <div v-if="!hideButtons">
      <div class="row justify-end">
        <q-btn v-if="clearButton !== ''" id="clear-button" color="primary" :label="clearButton" @click="clearEditor"/>
        <q-btn v-if="resetButton !== ''" id="reset-button" color="primary" :label="resetButton" @click="resetEditor"/>
        <q-btn v-if="applyButton !== ''" id="apply-button" color="primary" :label="applyButton" @click="apply"/>
      </div>
    </div>
  </div>
</template>

<script>
import KForm from '../form/KForm.vue'
import { service, objectProxy, schemaProxy, baseEditor } from '../../mixins'

export default {
  components: {
    KForm
  },
  mixins: [
    baseEditor,
    service,
    objectProxy,
    schemaProxy
  ],
  props: {
    hideButtons: {
      type: Boolean,
      default: false
    }
  },
  async mounted () {
    await this.refresh()
  }
}
</script>
