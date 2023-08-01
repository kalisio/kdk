<template>
  <div v-if="member !== null">
    <KModal
      id="add-tag-modal"
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
      return this.$t('KAddTag.TITLE', { member: this.member.name })
    },
    schema () {
      if (this.member === null) return {}
      const schema = {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: 'http://kalisio.xyz/schemas/add-tag#',
        title: 'Add Tag Form',
        type: 'object',
        properties: {
          tag: {
            type: 'object',
            multiselect: false,
            uniqueItems: true,
            minItems: 1,
            maxItems: 1,
            services: [{
              service: this.contextId + '/tags',
              field: 'value',
              baseQuery: {
                _id: { $nin: _.map(this.member.tags, '_id') },
                scope: 'members'
              },
              icon: {
                name: 'las la-tags'
              }
            }],
            field: {
              component: 'form/KItemField',
              label: 'KAddTag.TAG_FIELD_LABEL'
            }
          }
        },
        required: ['tag']
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
        { id: 'join-button', label: 'KAddTag.ADD_BUTTON', renderer: 'form-button', handler: (event, done) => this.tag(event, done) }
      ]
    },
    getService () {
      return this.$api.getService('members')
    },
    async tag () {
      const result = this.$refs.form.validate()
      if (result.isValid) {
        const tag = result.values.tag
        // Add context if any
        if (this.contextId) tag.context = this.contextId
        const membersService = this.getService()
        // Ensure no doublon
        if (!_.find(this.member.tags, { _id: result.values.tag._id })) {
          await membersService.patch(this.member._id, { tags: this.member.tags.concat([tag]) })
        }
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
