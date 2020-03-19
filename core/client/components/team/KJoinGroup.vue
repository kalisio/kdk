<template>
  <div v-if="member !== null">
    <k-modal ref="modal" :title="title" :toolbar="getToolbar()" :buttons="getButtons()" :route="true">
      <div slot="modal-content" class="column xs-gutter">
        <k-form ref="form" :schema="schema" />
      </div>
    </k-modal>
  </div>
</template>

<script>
import _ from 'lodash'
import mixins from '../../mixins'

export default {
  name: 'k-join-group',
  mixins: [
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
      return {
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
              helper: 'KJoinGroup.GROUP_FIELD_HELPER'
            }
          },
          role: {
            type: 'string',
            default: 'member',
            field: {
              component: 'form/KSelectField',
              helper: 'KJoinGroup.ROLE_FIELD_HELPER',
              type: 'radio',
              options: [
                { label: this.$t('KAddMember.MEMBER_LABEL'), value: 'member' },
                { label: this.$t('KAddMember.MANAGER_LABEL'), value: 'manager' },
                { label: this.$t('KAddMember.OWNER_LABEL'), value: 'owner' }
              ]
            }
          }
        },
        required: ['group', 'role']
      }
    }
  },
  data () {
    return {
      member: null
    }
  },
  methods: {
    getToolbar () {
      return [
        { name: 'close-action', label: this.$t('KAddMember.CLOSE_ACTION'), icon: 'close', handler: () => this.doClose() }
      ]
    },
    getButtons () {
      return [
        { name: 'join-button', label: this.$t('KJoinGroup.ADD_BUTTON'), color: 'primary', handler: (event, done) => this.doJoin(event, done) }
      ]
    },
    loadService () {
      return this.$api.getService('members')
    },
    async doJoin () {
      const result = this.$refs.form.validate()
      if (result.isValid) {
        const authorisationService = this.$api.getService('authorisations')
        await authorisationService.create({
          scope: 'groups',
          permissions: result.values.role,
          subjects: this.objectId,
          subjectsService: this.contextId + '/members',
          resource: result.values.group._id,
          resourcesService: this.contextId + '/groups'
        })
        this.doClose()
      }
    },
    doClose () {
      this.$refs.modal.close()
      this.$router.push({ name: 'members-activity' })
    }
  },
  async created () {
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-form'] = this.$load('form/KForm')
    // Load the member
    this.member = await this.loadObject()
  }
}
</script>
