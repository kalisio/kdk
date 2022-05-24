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
    <KModalEditor
      id="editor"
      :ref="onEditorCreated"
      service="settings"
      objectId="settings"
      :router-mode="false"
      :schema-properties="schemaFilter"
      @applied="onSettingsEdited"
    />
  </div>
</template>

<script>
import _ from 'lodash'
import KModalEditor from './KModalEditor.vue'

export default {
  name: 'k-settings-editor',
  components: {
    KModalEditor
  },
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
    onEditorCreated (ref) {
      this.editor = ref
    },
    editSettings () {
      this.editor.openModal()
      this.$emit('triggered')
    },
    onSettingsEdited () {
      this.editor.closeModal()
    }
  }
}
</script>
