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
    <div slot="card-content">
      <!-- Members -->
      <KCardSection :title="$t('KTagCard.MEMBERS_SECTION')" :dense="dense">
        <k-action
          id="list-members"
          icon="las la-user-friends"
          :label="$t('KTagCard.MEMBERS_LABEL', { count: item.count })"
          :tooltip="$t('KTagCard.VIEW_MEMBERS_LABEL')"
          @triggered="onListMembers" />
      </KCardSection>
    </div>
  </KCard>
</template>

<script>
import { baseItem } from '../../mixins'
import { KCard, KCardSection } from '../collection'
import KAction from '../frame/KAction.vue'

export default {
  name: 'k-tag-card',
  components: {
    KCard,
    KCardSection,
    KAction
  },
  mixins: [baseItem],
  computed: {
    dense () {
      return this.$q.screen.lt.sm
    }
  },
  methods: {
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
  }
}
</script>
