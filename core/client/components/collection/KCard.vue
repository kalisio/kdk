<template>
  <q-card bordered @click="onItemSelected">
    <!--
      Header section
    -->
    <div v-if="hasHeader">
      <div v-bind:class="{ 'q-px-sm q-py-xs': dense, 'q-px-md q-py-sm': !dense }">
        <slot name="card-header">
          <k-panel id="card-header-panel" :content="computedHeader" :context="$props" />
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
          <div>
            <slot name="card-avatar">
              <k-avatar 
                :object="item" 
                :size="dense ? 'sm' : 'md'" 
                :contextId="contextId" 
                :options="options" />
            </slot>
          </div>
          <div 
            class="text-subtitle1 text-weight-medium ellipsis-2-lines" 
            v-bind:class="{ 'q-px-sm q-py-xs': dense, 'q-px-md q-py-sm': !dense }" 
            style="overflow: hidden">
            {{ name }}
          </div>
        </div>
      </slot>
      <slot name="card-description">
        <!-- Description -->
        <k-card-section 
          :title="$t('KCard.DESCRIPTION_SECTION')" 
          :actions="descriptionActions" 
          :hideHeader="!isExpanded" 
          :dense="dense"
        >
          <div v-if="hasDescription">
            <k-text-area :text="item.description" />
          </div>
          <div v-else> 
            {{ $t('KCard.NO_DESCRIPTION_LABEL')}}
          </div>
        </k-card-section>
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
          <k-panel id="card-footer-panel" :content="computedFooter" :context="$props" />
        </slot>
      </div>
    </div>
    <!--
      Expand action
    -->
    <div v-if="expandable">
      <div class="row justify-center" v-bind:class="{ 'q-px-sm q-py-none': dense, 'q-px-md q-py-xs': !dense }">
        <k-action 
          id="expend-action" 
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
import mixins from '../../mixins'

export default {
  name: 'k-card',
  components: {
    KPanel,
    KAvatar,
    KTextArea,
    KAction,
    KCardSection
  },
  mixins: [mixins.baseItem],
  props: {
    header: {
      type: [Object, Array],
      default: () => null
    },
    footer: {
      type: [Object, Array],
      default: () => null
    },
    dense: {
      type: Boolean,
      default: false
    },
    expandable: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    computedHeader () {
      if (this.header) return this.header
      let actions = _.filter(this.itemActions, { scope: 'header' })
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
      let actions = _.filter(this.itemActions, { scope: 'footer' })
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
      isExpanded: this.expandable ? false : true
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
