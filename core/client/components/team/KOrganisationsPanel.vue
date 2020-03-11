<template>
  <div>
    <q-list link no-border>
      <q-separator />
      <!--
        Organisations list
      -->
      <template v-if="items.length > 1" v-for="org in items">
        <q-item v-ripple clickable :active="org._id === currentOrgId" :id="getId(org)" :key="org._id" @click="setCurrentOrganisation(org)">
          <q-item-section avatar><q-avatar size="24px" color="primary" text-color="white">{{getInitials(org)}}</q-avatar></q-item-section>
          <q-item-section>{{org.name}}</q-item-section>
          <q-item-section v-if="org._id === currentOrgId" side><q-icon name="check" /></q-item-section>
        </q-item>
      </template>
      <!--
        Create link
      -->
      <q-item v-ripple clickable id="new-organisation" @click="createOrganisation">
        <q-item-section avatar><q-icon name="add_circle" /></q-item-section>
        <q-item-section>{{$t('KOrganisationPanel.NEW_ORGANISATION')}}</q-item-section>
      </q-item>
    </q-list>
    <!--
      Create editor
     -->
    <k-modal-editor
      id="editor"
      ref="editor"
      service="organisations"
      @applied="onOrganisationCreated" />
  </div>
</template>

<script>
import _ from 'lodash'
import { utils } from '../../utils'
import { mixins } from '../../mixins'

export default {
  name: 'k-organisations-panel',
  mixins: [
    mixins.baseCollection
  ],
  inject: ['sideNav'],
  watch: {
    '$route' (to, from) {
      // React to route changes. Checks whether the context is null or not
      if (!this.$route.params.contextId) this.clearCurrentOrganisation()
    }
  },
  data () {
    return {
      currentOrgId: ''
    }
  },
  methods: {
    getId (org) {
      return _.kebabCase(org.name)
    },
    getInitials (org) {
      return kCoreUtils.getInitials(org.name)
    },
    loadService () {
      this._service = this.$api.getService('organisations')
      return this._service
    },
    getCollectionBaseQuery () {
      return {}
    },
    findOrganisation (id) {
      return this.items.find(org => org._id === id)
    },
    updateOrganisations () {
      const list = this.$store.get('user.organisations', [])
      this.filterQuery = { _id: { $in: list.map(org => { return org._id }) } }
      this.refreshCollection()
    },
    updateCurrentOrganisation () {
      if (this.currentOrgId) {
        if (!this.findOrganisation(this.currentOrgId)) {
          this.clearCurrentOrganisation()
          this.sideNav.navigate({ name: 'home' })
        }
      }
    },
    setCurrentOrganisation (org) {
      this.currentOrgId = org._id
      this.sideNav.navigate({ name: 'context', params: { contextId: org._id } })
    },
    clearCurrentOrganisation () {
      this.currentOrgId = ''
    },
    createOrganisation () {
      this.$refs.editor.open()
    },
    onOrganisationCreated (org) {
      this.currentOrgId = org._id
      this.$refs.editor.close()
      this.sideNav.navigate({ name: 'context', params: { contextId: org._id } })
    },
    onOrganisationRemoved (org) {
      this.$toast({
        type: 'warning',
        html: this.$t('KOrganisationPanel.ORGANISATION_REMOVED_WARNING', { organisation: org.name })
      })
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-modal-editor'] = this.$load('editor/KModalEditor')
    // Setup the current org if any
    if (this.$route.params.contextId) this.currentOrgId = this.$route.params.contextId
    // Update the list of organisations
    this.updateOrganisations()
    // Required when user permissions change
    this.$events.$on('user-changed', this.updateOrganisations)
    // Required to get the org objects first
    this.$on('collection-refreshed', this.updateCurrentOrganisation)
    // Required to get notify when an orga is deleted
    const organisationsService = this.$api.getService('organisations')
    organisationsService.on('removed', (org) => this.onOrganisationRemoved(org))
  },
  beforeDestroy () {
    this.$events.$off('user-changed', this.updateOrganisations)
    this.$off('collection-refreshed', this.updateCurrentOrganisation)
    const organisationsService = this.$api.getService('organisations')
    organisationsService.off('removed', this.onOrganisationRemoved)
  }
}
</script>
