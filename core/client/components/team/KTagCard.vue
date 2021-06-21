<template>
  <k-card 
    v-bind="$props"
    :header="header"
    :actions="itemActions" 
    :bind-actions="false"
    :options="{ nameField: 'value' }">
    <!--
      Card content
     -->
    <div slot="card-content">
      <!-- Members -->
      <k-card-section :title="$t('KTagCard.MEMBERS_SECTION')">      
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
    header () {
      return [
        { component: 'QSpace' },
        { 
          id: 'edit-group', icon: 'las la-edit', size: 'sm', tooltip: 'KTagCard.EDIT_ACTION',
          visible: this.$can('update', 'tags', this.contextId, this.item),
          handler: this.editItem
        }
      ]
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
      this.$router.push({ name: 'members-activity', params: { contextId: this.contextId, mode: 'filter' } 
      })
    }
  }
}
</script>
