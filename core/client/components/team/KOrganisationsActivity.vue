<template>
  <k-page padding>
    <template v-slot:page-content>
      <!--
        Organisations collection
      -->
      <k-grid
        ref="organisations"
        service="organisations"
        :renderer="renderer"
        :base-query="baseQuery"
        :filter-query="searchQuery"
        :list-strategy="'smart'" />
     <!--
      Creation editor
     -->
    <k-modal-editor
      id="organisation-editor"
      ref="editor"
      service="organisations"
      @applied="onOrganisationCreated" />
    </template>
  </k-page>
</template>

<script>
import mixins from '../../mixins'

export default {
  name: 'k-organisations-activity',
  mixins: [mixins.baseActivity()],
  data () {
    return {
      baseQuery: {
        $sort: {
          name: 1
        }
      },
      renderer: {
        component: 'team/KOrganisationCard'
      }
    }
  },
  methods: {
    createOrganisation () {
      this.$refs.editor.open()
    },
    onOrganisationCreated (org) {
      this.$refs.editor.close()
      // Do we navigate to the create org ?
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-page'] = this.$load('layout/KPage')
    this.$options.components['k-grid'] = this.$load('collection/KGrid')
    this.$options.components['k-modal-editor'] = this.$load('editor/KModalEditor')
  }
}
</script>
