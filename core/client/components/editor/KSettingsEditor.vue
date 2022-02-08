<template>
  <div>
    <q-list>
      <!--
        Edit link
      -->
      <q-item id="edit-settings" @click="editSettings" clickable v-ripple>
        <q-item-section avatar><q-icon name="las la-cog"/></q-item-section>
        <q-item-section>{{$t('SETTINGS')}}</q-item-section>
      </q-item>
    </q-list>
    <!--
      Create editor
     -->
    <k-modal-editor
      id="editor"
      ref="editor"
      service="settings"
      objectId="settings"
      :schema-properties="schemaFilter"
      @applied="onSettingsEdited" />
  </div>
</template>

<script>

export default {
  name: 'k-settings-editor',
  data () {
    let mapping = this.$api.getService('settings').getSettingsMapping()
    // Keep only properties declared in application mapping from the default editor schema
    // Filter also property forced to null to be discarded
    mapping = Object.keys(mapping).filter(value => _.get(mapping, value))
    return {
      schemaFilter: mapping
    }
  },
  methods: {
    editSettings () {
      this.$refs.editor.openModal()
      this.$emit('triggered')
    },
    onSettingsEdited () {
      this.$refs.editor.closeModal()
    }
  },
  beforeCreate () {
    // Load the required components
    this.$options.components['k-modal-editor'] = this.$load('editor/KModalEditor')
  }
}
</script>
