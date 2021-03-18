<template>
  <k-modal
    id="change-role-modal"
    :title="$t('KChangeRole.TITLE')" 
    :buttons="getButtons()" 
    v-model="isModalOpened"
    @opened="$emit('opened')"
    @closed="$emit('closed')">
    <div slot="modal-content" class="column xs-gutter">
      <k-form ref="form" :schema="getSchema()" />
    </div>
  </k-modal>
</template>

<script>
import mixins from '../../mixins'

export default {
  name: 'k-change-role',
  mixins: [
    mixins.baseModal,
    mixins.refsResolver(['form'])
  ],
  props: {
    contextId: {
      type: String,
      required: true
    },
    objectId: {
      type: String,
      required: true
    },
    resource: {
      type: Object,
      required: true
    }
  },
  methods: {
    getSchema () {
      return {
        $schema: 'http://json-schema.org/draft-06/schema#',
        $id: 'http://kalisio.xyz/schemas/change-role#',
        title: 'Change role form',
        type: 'object',
        properties: {
          role: {
            type: 'string',
            default: 'member',
            field: {
              component: 'form/KSelectField',
              label: 'KChangeRole.ROLE_FIELD_LABEL',
              type: 'radio',
              options: [
                { label: this.$t('KChangeRole.MEMBER_LABEL'), value: 'member' },
                { label: this.$t('KChangeRole.MANAGER_LABEL'), value: 'manager' },
                { label: this.$t('KChangeRole.OWNER_LABEL'), value: 'owner' }
              ]
            }
          }
        },
        required: ['role']
      }
    },
    getButtons () {
      return [
        { id: 'update-button', label: 'KChangeRole.UPDATE_BUTTON', color: 'primary', handler: () => this.doUpdate() }
      ]
    },
    async doUpdate () {
      const result = this.$refs.form.validate()
      if (result.isValid) {
        const authorisationService = this.$api.getService('authorisations')
        await authorisationService.create({
          scope: this.resource.scope,
          permissions: result.values.role,
          subjects: this.objectId,
          subjectsService: this.contextId + '/members',
          resource: this.resource.id,
          resourcesService: this.resource.service
        })
        this.closeModal()
      }
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-form'] = this.$load('form/KForm')
  }
}
</script>
