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
      />
    </div>
    <!--
      Buttons section
    -->
    <div>
      <div class="q-pt-md row justify-end">
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
  async created () {
    await this.refresh()
  }
}
</script>
