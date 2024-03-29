<template>
  <div v-if="member !== null">
    <KModal
      id="join-group-modal"
      :title="title"
      :buttons="getButtons()"
      v-model="isModalOpened"
    >
      <!-- Modal content -->
      <KForm
        ref="form"
        :schema="schema"
      />
    </KModal>
  </div>
</template>

<script>
import _ from 'lodash'
import KModal from '../KModal.vue'
import KForm from '../form/KForm.vue'
import { Roles, getRoleForOrganisation } from '../../../common/permissions'
import { baseModal, objectProxy } from '../../mixins'

export default {
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
    }
  },
  emits: ['opened', 'closed'],
  computed: {
    title () {
      if (this.member === null) return ''
      return this.$t('KJoinGroup.TITLE', { member: this.member.name })
    },
    schema () {
      if (this.member === null) return {}
      const schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: 'http://kalisio.xyz/schemas/join-group#',
        title: 'Join Group Form',
        type: 'object',
        properties: {
          group: {
            type: 'object',
            multiselect: false,
            uniqueItems: true,
            minItems: 1,
            maxItems: 1,
            services: [{
              service: this.contextId + '/groups',
              field: 'name',
              baseQuery: {
                _id: { $nin: _.map(this.member.groups, '_id') }
              },
              icon: {
                name: 'group_work'
              }
            }],
            field: {
              component: 'form/KItemField',
              label: 'KJoinGroup.GROUP_FIELD_LABEL'
            }
          }
        },
        required: ['group']
      }
      if (Roles[this.role] === Roles.member) {
        _.set(schema, 'properties.role', {
          type: 'boolean',
          default: false,
          field: {
            component: 'form/KToggleField',
            label: 'KJoinGroup.ROLE_FIELD_LABEL'
          }
        })
      }
      return schema
    }
  },
  data () {
    return {
      member: null
    }
  },
  methods: {
    getButtons () {
      return [
        { id: 'cancel-button', label: 'CANCEL', renderer: 'form-button', outline: true, handler: () => this.closeModal() },
        { id: 'join-button', label: 'KJoinGroup.ADD_BUTTON', renderer: 'form-button', handler: (event, done) => this.doJoin(event, done) }
      ]
    },
    getService () {
      return this.$api.getService('members')
    },
    async doJoin () {
      const result = this.$refs.form.validate()
      if (result.isValid) {
        const authorisationService = this.$api.getService('authorisations')
        await authorisationService.create({
          scope: 'groups',
          permissions: _.get(result, 'values.role', false) ? 'manager' : 'member',
          subjects: this.objectId,
          subjectsService: this.contextId + '/members',
          resource: result.values.group._id,
          resourcesService: this.contextId + '/groups'
        })
        this.closeModal()
      }
    }
  },
  async created () {
    // Load the member
    this.member = await this.loadObject()
    this.role = getRoleForOrganisation(this.member, this.contextId)
  }
}
</script>
