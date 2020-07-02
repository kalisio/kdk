<template>
  <div :class="getLayout()">
    <q-card bordered @click="onItemSelected">
      <!--
        Header section
      -->
      <slot name="card-header" />
      <!--
        Title section
      -->
      <slot name="card-title">
        <q-item>
          <q-item-section top avatar>
            <slot name="card-avatar">
              <q-avatar v-if="avatar.type === 'text'" color="primary" text-color="white" >{{ avatar.text }}</q-avatar>
              <q-avatar v-if="avatar.type === 'icon'" :color="avatar.icon.color" text-color="white" :icon="avatar.icon.name" />
            </slot>
          </q-item-section>
          <q-item-section>
            <slot name="card-label">
              <q-item-label class="text-subtitle1 text-weight-medium">
                <k-text-area :text="name" />
              </q-item-label>
              <q-item-label>
                <k-text-area :text="description" />
              </q-item-label>
            </slot>
          </q-item-section>
        </q-item>
      </slot>
      <!--
        Content section
      -->
      <slot name="card-content" />
      <!--
        Actions section
      -->
      <q-separator />
      <slot name="card-actions">
        <q-card-actions class="q-pa-sm" align="right">
          <!-- Pane -->
          <k-tool-bar id="card-toolbar" :actions="itemActions.pane" :context="item" :dense="$q.screen.lt.md" />
          <!-- Menu -->
          <k-overflow-menu id="card-overflow-menu" :actions="itemActions.menu" :context="item" :dense="$q.screen.lt.md" />
        </q-card-actions>
      </slot>
    </q-card>
  </div>
</template>

<script>
import _ from 'lodash'
import mixins from '../../mixins'

export default {
  name: 'k-card',
  mixins: [mixins.baseItem],
  props: {
    itemActions: {
      type: Object,
      default: function () {
        return {
          pane: [],
          menu: []
        }
      }
    }
  },
  methods: {
    getLayout () {
      return _.get(this.options, 'layout', 'col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3')
    }
  },
  created () {
    // Loads the required components
    this.$options.components['k-text-area'] = this.$load('frame/KTextArea')
    this.$options.components['k-tool-bar'] = this.$load('layout/KToolBar')
    this.$options.components['k-overflow-menu'] = this.$load('layout/KOverflowMenu')
  }
}
</script>
