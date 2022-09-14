<template>
  <q-card bordered @click="onItemSelected" class="no-shadow">
    <!--
      Header section
    -->
    <div v-if="hasHeader">
      <div v-bind:class="{ 'q-px-sm q-pt-xs': dense, 'q-px-md q-pt-sm': !dense }">
        <slot name="card-header">
          <div class="row full-width">
            <k-panel id="card-header-panel" :content="computedHeader" :context="$props" class="full-width" />
          </div>
        </slot>
      </div>
    </div>
    <!--
      Title section
    -->
    <div class="column full-width"
      v-bind:class="{ 'q-px-sm q-pt-xs q-gutter-y-xs': dense, 'q-px-md q-pt-sm q-gutter-y-sm': !dense }">
      <slot name="card-title">
        <div class="row full-width justify-start items-center no-wrap">
          <div v-if="avatar" v-bind:class="{ 'q-pr-xs': dense, 'q-pr-sm': !dense }">
            <slot name="card-avatar">
              <KAvatar
                :object="item"
                :size="dense ? 'sm' : 'md'"
                :contextId="contextId"
                :options="options" />
            </slot>
          </div>
          <div
            class="text-subtitle1 text-weight-medium ellipsis"
            v-bind:class="{ 'q-py-xs': dense, 'q-py-sm': !dense }"
            style="overflow: hidden">
            {{ name }}
          </div>
        </div>
      </slot>
      <slot name="card-description">
        <!-- Description -->
        <KCardSection
          :title="$t('KCard.DESCRIPTION_SECTION')"
          :actions="descriptionActions"
          :hideHeader="!isExpanded"
          :dense="dense"
        > 
          <div class="q-pb-xs"> 
            <KTextArea 
              :text="item.description || $tie('KCard.NO_DESCRIPTION_LABEL')" 
              :dense="dense" 
            />
          </div>
        </KCardSection>
      </slot>
    </div>
    <!--
      Content section
    -->
    <div v-bind:class="{ 'q-px-sm': dense, 'q-px-md': !dense }">
      <slot name="card-content" />
    </div>
    <!--
      Footer section
    -->
    <div v-if="hasFooter">
      <q-separator />
      <div v-bind:class="{ 'q-px-sm q-py-xs': dense, 'q-px-md q-py-sm': !dense }">
        <slot name="card-footer">
          <div class="row justify-end">
            <k-panel id="card-footer-panel" :content="computedFooter" :context="$props" />
          </div>
        </slot>
      </div>
    </div>
    <!--
      Expand action
    -->
    <div v-if="expandable">
      <div class="row justify-center">
        <k-action
          id="expand-action"
          :icon="isExpanded ? 'las la-angle-up' : 'las la-angle-down'"
          :tooltip="isExpanded ? 'KCard.LESS_ACTION' : 'KCard.MORE_ACTION'"
          size="sm"
          @triggered="onExpandTriggered" />
      </div>
    </div>
  </q-card>
</template>

<script>
import _ from 'lodash'
import { KPanel, KAvatar, KTextArea, KAction } from '../frame'
import KCardSection from './KCardSection.vue'
import { baseItem } from '../../mixins'

export default {
  components: {
    KPanel,
    KAvatar,
    KTextArea,
    KAction,
    KCardSection
  },
  mixins: [baseItem],
  emits: [
    'expanded',
    'collapsed'
  ],
  props: {
    header: {
      type: [Object, Array],
      default: () => null
    },
    footer: {
      type: [Object, Array],
      default: () => null
    },
    expandable: {
      type: Boolean,
      default: false
    },
    avatar: {
      type: Boolean,
      default: true
    },
    dense: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    computedHeader () {
      if (this.header) return this.header
      const actions = _.filter(this.itemActions, { scope: 'header' })
      if (_.isEmpty(actions)) return []
      actions.splice(0, 0, { component: 'QSpace' })
      return actions
    },
    hasHeader () {
      return !_.isEmpty(this.computedHeader)
    },
    hasDescription () {
      return !_.isEmpty(this.description)
    },
    descriptionActions () {
      return _.filter(this.itemActions, { scope: 'description' })
    },
    computedFooter () {
      if (this.footer) return this.footer
      const actions = _.filter(this.itemActions, { scope: 'footer' })
      if (_.isEmpty(actions)) return []
      actions.splice(0, 0, { component: 'QSpace' })
      return actions
    },
    hasFooter () {
      return !_.isEmpty(this.computedFooter)
    }
  },
  data () {
    return {
      isExpanded: !this.expandable
    }
  },
  methods: {
    onExpandTriggered () {
      this.isExpanded = !this.isExpanded
      if (this.isExpanded) this.$emit('expanded')
      else this.$emit('collapsed')
    }
  }
}
</script>
