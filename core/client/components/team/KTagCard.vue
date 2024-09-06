<template>
  <KCard
    v-bind="$props"
    :actions="itemActions"
    :bind-actions="false"
    :options="{ nameField: 'value' }"
    :dense="dense">
    <!--
      Card content
     -->
    <template v-slot:card-content>
      <!-- Members -->
      <KCardSection :title="$t('KTagCard.MEMBERS_SECTION')" :dense="dense">
        <KAction
          id="list-members"
          icon="las la-user-friends"
          :label="$t('KTagCard.MEMBERS_LABEL', { count: membersCount })"
          :tooltip="$t('KTagCard.VIEW_MEMBERS_LABEL')"
          @triggered="onListMembers"
        />
      </KCardSection>
    </template>
  </KCard>
</template>

<script>
import { baseItem } from '../../mixins'
import { countMembersWithTag } from '../../../common/permissions'
import { KCard, KCardSection } from '../collection'
import KAction from '../action/KAction.vue'

export default {
  name: 'k-tag-card',
  components: {
    KCard,
    KCardSection,
    KAction
  },
  mixins: [baseItem],
  data () {
    return {
      membersCount: 0
    }
  },
  computed: {
    dense () {
      return this.$q.screen.lt.sm
    }
  },
  methods: {
    async refreshStats () {
      const membersService = this.$api.getService('members', this.contextId)
      const members = await countMembersWithTag(membersService, this.item._id)
      this.membersCount = members.total
    },
    onListMembers () {
      // Setup filter accordingly
      this.$store.patch('filter', {
        items: [Object.assign({
          service: 'tags',
          field: 'value'
        }, this.item)]
      })
      this.$router.push({ name: 'members-activity', params: { contextId: this.contextId, mode: 'filter' } })
    }
  },
  created () {
    // Compute the count of members having the tag
    this.refreshStats()
  }
}
</script>
