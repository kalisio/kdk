<template>
  <k-modal ref="modal" :title="$t('KAddMember.TITLE')" :toolbar="getToolbar()" :buttons="getButtons()" :route="true">
    <div slot="modal-content" class="column xs-gutter">
      <k-form ref="form" :schema="getSchema()" />
    </div>
  </k-modal>
</template>

<script>
import mixins from '../../mixins'

export default {
  name: 'k-add-member',
  mixins: [
    mixins.refsResolver(['form'])
  ],
  props: {
    contextId: {
      type: String,
      required: true
    }
  },
  methods: {
    getSchema () {
      return {
        $schema: 'http://json-schema.org/draft-06/schema#',
        $id: 'http://kalisio.xyz/schemas/add-member#',
        title: 'Add Member Form',
        type: 'object',
        properties: {
          user: {
            type: 'object',
            multiselect: false,
            uniqueItems: true,
            minItems: 1,
            maxItems: 1,
            services: [{
              service: 'users',
              field: 'profile.name',
              subfield: 'email',
              baseQuery: {
                'organisations._id': { $nin: [this.contextId] },
                $select: ['email', 'profile']
              },
              icon: {
                name: 'person'
              }
            }],
            field: {
              component: 'form/KItemField',
              helper: 'KAddMember.USER_FIELD_HELPER'
            }
          },
          role: {
            type: 'string',
            default: 'member',
            field: {
              component: 'form/KSelectField',
              helper: 'KAddMember.ROLE_FIELD_HELPER',
              type: 'radio',
              options: [
                { label: this.$t('KAddMember.MEMBER_LABEL'), value: 'member' },
                { label: this.$t('KAddMember.MANAGER_LABEL'), value: 'manager' },
                { label: this.$t('KAddMember.OWNER_LABEL'), value: 'owner' }
              ]
            }
          }
        },
        required: ['user', 'role']
      }
    },
    getToolbar () {
      return [
        { name: 'close-action', label: this.$t('KAddMember.CLOSE_ACTION'), icon: 'close', handler: () => this.doClose() }
      ]
    },
    getButtons () {
      return [
        { name: 'add-button', label: this.$t('KAddMember.ADD_BUTTON'), color: 'primary', handler: () => this.doAdd() }
      ]
    },
    async doAdd () {
      const result = this.$refs.form.validate()
      if (result.isValid) {
        const authorisationService = this.$api.getService('authorisations')
        await authorisationService.create({
          scope: 'organisations',
          permissions: result.values.role,
          subjects: result.values.user._id,
          subjectsService: 'users',
          resource: this.contextId,
          resourcesService: 'organisations'
        })
        this.doClose()
      }
    },
    doClose () {
      this.$refs.modal.close()
      this.$router.push({ name: 'members-activity' })
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-form'] = this.$load('form/KForm')
  }
}
</script>
