<template>
  <div class="q-lf-lg fit row">
    <div v-if="separator" class="row full-width">
      <div class="q-pa-sm col-xs-12 col-sm-3 col-md-12 row justify-center">
        <q-chip :label="formattedDay" square color="grey-7" text-color="white" />
      </div>
    </div>
    <div class="row full-width">
      <div v-if="$q.screen.gt.sm" class="col-5">
        <component
          v-if="item.side === 'left'"
          :id="item._id"
          :item="item"
          :contextId="contextId"
          :is="renderer.component"
          v-bind="renderer" />
      </div>
      <div class="col-xs-12 col-sm-3 col-md-2 q-pa-sm">
        <div class="fit column content-center">
          <div class="col row justify-center k-history-line">
            <q-chip :label="formattedHours" />
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-8 col-md-5">
        <component
          v-if="$q.screen.lt.md || item.side === 'right'"
          :id="item._id"
          :item="item"
          :contextId="contextId"
          :is="renderer.component"
          v-bind="renderer" />
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import mixins from '../../mixins'
import { Time } from '../..'

export default {
  name: 'k-history-entry',
  mixins: [mixins.baseItem],
  props: {
    renderer: {
      type: Object,
      required: true
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
  },
  created () {
    // Load the renderer component
    this.$options.components[this.renderer.component] = this.$load(this.renderer.component)
  }
}
</script>

<style lang="stylus">
.k-history-line {
  background: linear-gradient($grey-4, $grey-4) no-repeat center/5px 90%;
}
</style>