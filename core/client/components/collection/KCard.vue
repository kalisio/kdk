<template>
  <q-card
    bordered
    :class="computedClass"
    @click="onItemSelected"
  >
    <!--
      Header section
    -->
    <div
      v-if="hasHeader"
      :class="{ 'q-px-sm q-pt-xs': dense, 'q-px-md q-pt-sm': !dense }"
    >
      <KPanel
        id="card-header-panel"
        :content="computedHeader"
        :context="$props"
        class="full-width no-wrap"
      />
    </div>
    <!--
      Heading section
    -->
    <div
      class="column full-width"
      v-bind:class="{ 'q-px-sm q-pt-xs': dense, 'q-px-md q-pt-sm': !dense }"
    >
      <slot name="card-heading">
        <div class="row full-width items-center no-wrap">
          <div
            v-if="avatar"
            :class="{ 'q-pr-xs': dense, 'q-pr-sm': !dense }"
          >
            <slot name="card-avatar">
              <KAvatar
                :subject="item"
                :size="dense ? 'sm' : 'md'"
                :options="options"
              />
            </slot>
          </div>
          <div
            class="text-subtitle1 text-weight-medium ellipsis-2-lines"
            v-bind:class="{ 'q-py-xs': dense, 'q-py-sm': !dense }"
          >
            {{ name }}
          </div>
        </div>
      </slot>
    </div>
    <!--
      Content section
    -->
    <div :class="{ 'q-px-sm': dense, 'q-px-md': !dense }">
      <slot name="card-content">
        <!-- Visible sections -->
        <KPanel
          :content="visibleSections"
          :context="$props"
          direction="vertical"
        />
        <!-- Expansion sections -->
        <KPanel v-if="isExpanded"
          :content="expandableSections"
          :context="$props"
          direction="vertical"
        />
      </slot>
    </div>
    <!--
      Footer section
    -->
    <div>
      <slot name="card-footer">
        <div v-if="hasFooter">
          <q-separator />
          <div :class="{ 'q-px-sm q-pt-xs': dense, 'q-px-md q-pt-sm': !dense }">
            <KPanel
              id="card-footer-panel"
              :content="computedFooter"
              :context="$props"
              class="full-width no-wrap"
            />
          </div>
        </div>
      </slot>
    </div>
    <!--
      Expand action
    -->
    <div v-if="isExpandable" class="row justify-center">
      <KAction
        id="expand-action"
        icon="las la-angle-down"
        tooltip="KCard.MORE_DETAILS"
        :toggle="{ icon: 'las la-angle-up', tooltip: 'KCard.LESS_DETAILS', color: 'grey-7' }"
        :size="dense ? 'xs' : 'sm'"
        dense
        @triggered="onExpandTriggered"
      />
    </div>
    <!-- Extra bottom padding if no expand action -->
    <div v-else :class="{ 'q-pt-xs': dense, 'q-pt-sm': !dense }" />
  </q-card>
</template>

<script>
import _ from 'lodash'
import KAction from '../action/KAction.vue'
import KPanel from '../KPanel.vue'
import KAvatar from '../KAvatar.vue'
import KDescriptionCardSection from './KDescriptionCardSection.vue'
import { baseItem } from '../../mixins'

export default {
  components: {
    KPanel,
    KAvatar,
    KAction,
    KDescriptionCardSection
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
    sections: {
      type: Object,
      default: () => null
    },
    footer: {
      type: [Object, Array],
      default: () => null
    },
    shadow: {
      type: Number,
      default: 0,
      validator: (value) => {
        return value >= 0 && value <= 24
      }
    },
    dense: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    computedClass () {
      return this.shadow > 0 ? `shadow-${this.shadow}` : 'no-shadow'
    },
    computedHeader () {
      if (this.header) return this.header
      return _.filter(this.itemActions, { scope: 'header' })
    },
    hasHeader () {
      return !_.isEmpty(this.computedHeader)
    },
    computedSections () {
      return _.map(this.sections, (value, key) => {
        return {
          item: this.item,
          actions: _.filter(this.itemActions, { scope: key }),
          dense: this.dense,
          ...value
        }
      })
    },
    visibleSections () {
      return _.filter(this.computedSections, section => {
        return section.scope !== 'expansion'
      })
    },
    expandableSections () {
      return _.filter(this.computedSections, { scope: 'expansion' })
    },
    isExpandable () {
      return !_.isEmpty(this.expandableSections)
    },
    computedFooter () {
      if (this.footer) return this.footer
      return _.filter(this.itemActions, { scope: 'footer' })
    },
    hasFooter () {
      return !_.isEmpty(this.computedFooter)
    }
  },
  data () {
    return {
      isExpanded: false
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
