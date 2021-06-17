<template>
  <div class="q-lf-lg fit row">
    <div v-if="separator" class="row full-width">
      <div class="q-pa-sm col-xs-12 col-sm-3 col-md-12 row justify-center">
        <q-chip :label="formattedDay" square color="grey-7" text-color="white" />
      </div>
    </div>
    <div class="row full-width">
      <div v-if="$q.screen.gt.sm" class="col-5">
        <q-card v-if="item.side === 'left'" bordered @click="onItemSelected">
          <!--
            Header section
          -->
          <slot name="history-entry-header">
            <div class="q-pa-sm">
              <k-panel v-if="header" :content="header" :context="$props" />
            </div>
          </slot>
          <!--
            Title section
          -->
          <slot name="history-entry-title">
            <q-item class="q-pa-sm">
              <q-item-section top avatar>
                <slot name="card-avatar">
                  <k-avatar :object="item" :contextId="contextId" :options="options" />
                </slot>
              </q-item-section>
              <q-item-section>
                <slot name="history-entry-label">
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
          <slot name="history-entry-content" />
          <!--
            Actions section
          -->
          <slot name="history-entry-actions">
            <q-separator v-if="itemActions" />
            <q-card-actions class="q-pa-xs" align="left">
              <k-panel id="card-actions" :content="itemActions" :context="$props" />
            </q-card-actions>
          </slot>
        </q-card>
      </div>
      <div class="col-xs-12 col-sm-3 col-md-2 q-pa-sm">
        <div class="fit column content-center">
          <div class="col row justify-center k-history-line">
            <q-chip :label="formattedHours" />
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-8 col-md-5">
        <q-card v-if="$q.screen.lt.md || item.side === 'right'" bordered @click="onItemSelected">
          <!--
            Header section
          -->
          <slot name="history-entry-header">
            <div class="q-pa-sm">
              <k-panel v-if="header" :content="header" :context="$props" />
            </div>
          </slot>
          <!--
            Title section
          -->
          <slot name="history-entry-title">
            <q-item class="q-pa-sm">
              <q-item-section top avatar>
                <slot name="card-avatar">
                  <k-avatar :object="item" :contextId="contextId" :options="options" />
                </slot>
              </q-item-section>
              <q-item-section>
                <slot name="history-entry-label">
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
          <slot name="history-entry-content" />
          <!--
            Actions section
          -->
          <slot name="history-entry-actions">
            <q-separator v-if="itemActions" />
            <q-card-actions class="q-pa-xs" align="right">
              <k-panel id="card-actions" :content="itemActions" :context="$props" />
            </q-card-actions>
          </slot>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import mixins from '../../mixins'
import { Time } from '../..'
import { KPanel, KAvatar, KTextArea } from '../frame'

export default {
  name: 'k-history-entry',
  components: {
    KPanel,
    KAvatar,
    KTextArea
  },
  mixins: [mixins.baseItem],
  props: {
    header: {
      type: [Object, Array],
      default: () => null
    },
    dateField: {
      type: String,
      default: 'createdAt'
    }
  },
  data () {
    return {
      date: moment(_.get(this.item, this.dateField))
    }
  },
  computed: {
    formattedDay () {
      return _.capitalize(Time.format(this.date, 'date.long'))
    },
    formattedHours () {
      return _.capitalize(Time.format(this.date, 'hour.long'))
    },
    separator () {
      if (!this.item.previous) return true
      const previousDate = moment(_.get(this.item.previous, this.dateField))
      if (!this.date.isValid() || !previousDate.isValid()) return true
      if (this.date.year() !== previousDate.year()) return true
      if (this.date.month() !== previousDate.month()) return true
      return this.date.date() !== previousDate.date()
    }
  }
}
</script>

<style lang="stylus">
.k-history-line {
  background: linear-gradient($grey-4, $grey-4) no-repeat center/5px 90%;
}
</style>