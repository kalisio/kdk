<template>
  <div :class="layout()">
    <q-card @click="onItemSelected">
      <!--
        Title section
      -->
      <slot name="card-title">
        <q-item>
          <q-item-section avatar v-if="options.avatar">
            <q-avatar v-if="name" color="primary" text-color="white" :size="options.avatar.size">{{initials}}</q-avatar>
          </q-item-section>
          <q-item-section>
          {{ name }}
          <small><k-text-area :length="20" :text="description" /></small>
          </q-item-section>
          <q-item-section side><slot name="card-icon"></slot></q-item-section>
        </q-item>
        <q-separator />
      </slot>
      <!--
        Content section
      -->
      <q-card-section>
        <slot name="card-tags">
          <div v-if="tags && tags.length > 0">
            <div class="row justify-start items-center">
              <template v-for="tag in tags">
                <q-chip v-if="options.tags && options.tags === 'chip'"
                        :key="key(tag, 'value')"
                        dense
                        text-color="white"
                        :color="tag.icon.color"
                        :icon="tag.icon.name"
                        :label="tag.value"/>
                <q-icon v-else
                        :key="key(tag, 'value')"
                        size="24px"
                        :color="tag.icon.color"
                        :name="tag.icon.name">
                  <q-tooltip>{{tag.value}}</q-tooltip>
                </q-icon>
              </template>
            </div>
            <q-separator />
          </div>
        </slot>
        <slot name="card-content"></slot>
      </q-card-section>
      <!--
        Actions section
      -->
      <q-separator />
      <slot name="card-actions">
        <q-card-actions class="q-pa-xs" align="right">
          <!-- Pane -->
          <k-tool-bar :actions="itemActions.pane" :context="item" :dense="$q.screen.lt.md" />
          <!-- Menu -->
          <k-overflow-menu :actions="itemActions.menu" :context="item" :dense="$q.screen.lt.md" />
        </q-card-actions>
      </slot>
    </q-card>
  </div>
</template>

<script>
import _ from 'lodash'
import { KTextArea } from '../frame'
import { getInitials, processIcon } from '../../utils'
import mixins from '../../mixins'

export default {
  name: 'k-card',
  mixins: [mixins.baseItem],
  components: {
    KTextArea
  },
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
  computed: {
    name () {
      // Check for custom name field
      return (this.options.nameField ? _.get(this.item, this.options.nameField, '') : this.item.name)
    },
    initials () {
      return getInitials(this.name)
    },
    description () {
      // Check for custom description field
      return this.options.descriptionField ? _.get(this.item, this.options.descriptionField, '') : this.item.description
    },
    tags () {
      // Check for custom tags field
      let tags = this.options.tagsField ? _.get(this.item, this.options.tagsField, '') : this.item.tags
      // Filter tags from current context
      tags = _.filter(tags, { context: this.$store.get('context._id') })
      // Then process icons
      tags.forEach(tag => processIcon(tag))
      return tags
    }
  },
  data () {
    return {
      descriptionTruncated: true,
      descriptionToggle: false
    }
  },
  methods: {
    layout () {
      return _.get(this.options, 'layout', 'col-xs-12 col-sm-6 col-md-4 col-lg-4 col-xl-3')
    },
    key (object, property) {
      return this.item._id + '-' + object[property]
    }
  },
  created () {
    // Loads the required components
    this.$options.components['k-tool-bar'] = this.$load('layout/KToolBar')
    this.$options.components['k-overflow-menu'] = this.$load('layout/KOverflowMenu')
  }
}
</script>
