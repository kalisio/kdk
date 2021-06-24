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
      v-bind:class="{ 'q-px-sm q-py-xs q-gutter-y-xs': dense, 'q-px-md q-py-sm q-gutter-y-sm': !dense }">
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
        <k-card-section v-if="displayDescription" :title="$t('KCard.DESCRIPTION_SECTION')" :actions="descriptionActions" :dense="dense">
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
    <div v-bind:class="{ 'q-px-sm q-py-xs': dense, 'q-px-md q-py-sm': !dense }">
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
  </q-card>
</template>

<script>
import _ from 'lodash'
import { KPanel, KAvatar, KTextArea } from '../frame'
import KCardSection from './KCardSection.vue'
import mixins from '../../mixins'

export default {
  name: 'k-card',
  components: {
    KPanel,
    KAvatar,
    KTextArea,
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
    displayDescription () {
      return _.get(this.options, 'displayDescription', true)
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
  }
}
</script>
