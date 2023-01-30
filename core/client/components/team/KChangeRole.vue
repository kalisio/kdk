<template>
  <KModal
    id="change-role-modal"
    :title="title"
    :buttons="buttons"
    v-model="isModalOpened"
  >
    <KForm
      v-if="member"
      ref="form"
      :schema="schema"
    />
  </KModal>
</template>

<script>
import _ from 'lodash'
import { baseModal, objectProxy } from '../../mixins'
import KModal from '../KModal.vue'
import KForm from '../form/KForm.vue'

export default {
  emits: ['opened', 'closed'],
  components: {
    KModal,
    KForm
  },
  mixins: [
    baseModal,
    objectProxy
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
      default: () => null
    }
  },
  computed: {
    title () {
      return this.$t('KChangeRole.TITLE', { member: this.member ? this.member.name : '' })
    },
    schema () {
      const scope = this.getScope()
      const resourceId = this.getResourceId()
      const currentRole = _.get(_.find(this.member[scope], { _id: resourceId }), 'permissions')
      const roles = ['member', 'manager']
      if (this.getScope() === 'organisations') roles.push('owner')
      return {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: 'http://kalisio.xyz/schemas/change-role#',
        type: 'object',
        properties: {
          role: {
            type: 'string',
            default: currentRole,
            field: {
              component: 'form/KRoleField',
              label: 'KChangeRole.ROLE_FIELD_LABEL',
              roles
            }
          }
        },
        required: ['role']
      }
    }
  },
  data () {
    return {
      member: null,
      buttons: [
        { id: 'cancel-button', label: 'CANCEL', renderer: 'form-button', outline: true, handler: () => this.closeModal() },
        { id: 'update-button', label: 'KChangeRole.UPDATE_BUTTON', renderer: 'form-button', handler: () => this.doUpdate() }
      ]
    }
  },
  methods: {
    getScope () {
      return _.get(this.resource, 'scope', 'organisations')
    },
    getResourceId () {
      return _.get(this.resource, 'id', this.contextId)
    },
    getResoureceService () {
      return _.get(this.resource, 'service', 'organisations')
    },
    getService () {
      return this.$api.getService('members')
    },
    async doUpdate () {
      const result = this.$refs.form.validate()
      if (result.isValid) {
        const authorisationService = this.$api.getService('authorisations')
        await authorisationService.create({
          scope: this.getScope(),
          permissions: result.values.role,
          subjects: this.objectId,
          subjectsService: this.contextId + '/members',
          resource: this.getResourceId(),
          resourcesService: this.getResoureceService()
        })
        this.closeModal()
      }
    }
  },
  async created () {
    // Load the member
    this.member = await this.loadObject()
  }
}
</script>
