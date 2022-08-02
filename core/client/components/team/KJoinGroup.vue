<template>
  <div v-if="member !== null">
    <k-modal
      id="join-group-modal"
      :title="title"
      :buttons="getButtons()"
      v-model="isModalOpened"
      @opened="$emit('opened')"
      @closed="$emit('closed')"
    >
      <k-form ref="form" :schema="schema" />
    </k-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import { Roles, getRoleForOrganisation } from '../../../common/permissions'
import mixins from '../../mixins'

export default {
  name: 'k-join-group',
  mixins: [
    mixins.baseModal,
    mixins.objectProxy,
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
    }
  },
  computed: {
    title () {
      if (this.member === null) return ''
      return this.$t('KJoinGroup.TITLE', { member: this.member.name })
    },
    schema () {
      if (this.member === null) return {}
      const schema = {
        $schema: 'http://json-schema.org/draft-06/schema#',
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
  beforeCreate () {
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-form'] = this.$load('form/KForm')
  },
  async created () {
    // Load the member
    this.member = await this.loadObject()
    this.role = getRoleForOrganisation(this.member, this.contextId)
  }
}
</script>
