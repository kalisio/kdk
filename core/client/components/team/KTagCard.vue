<template>
  <k-card
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
      <k-card-section :title="$t('KTagCard.MEMBERS_SECTION')" :dense="dense">
        <q-list>
          <q-item
            id="list-members"
            clickable
            @click="onListMembers">
            <q-item-section avatar>
              <q-icon name="las la-user-friends" />
            </q-item-section>
            <q-item-section>
              <q-item-label>
                {{ $t(`KTagCard.MEMBERS_LABEL`, { count: item.count }) }}
              </q-item-label>
              <q-tooltip>
                {{ $t(`KTagCard.VIEW_MEMBERS_LABEL`) }}
              </q-tooltip>
            </q-item-section>
          </q-item>
        </q-list>
      </k-card-section>
    </div>
  </k-card>
</template>

<script>
import mixins from '../../mixins'
import { KCard, KCardSection } from '../collection'

export default {
  name: 'k-tag-card',
  components: {
    KCard,
    KCardSection
  },
  mixins: [mixins.baseItem],
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
