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
    return {
      // Keep only properties declared in application mapping from the default editor schema
      schemaFilter: Object.keys(this.$api.getService('settings').getSettingsMapping())
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
  created () {
    // Load the required components
    this.$options.components['k-modal-editor'] = this.$load('editor/KModalEditor')
  }
}
</script>