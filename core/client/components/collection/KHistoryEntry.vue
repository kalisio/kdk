<template>
  <div class="q-lf-lg fit row">
    <div v-if="monthSeparator" class="row full-width justify-center items-center">
      <div class="col-3">
        <q-separator class="bg-grey-7" style="height: 3px;" />
      </div>
      <q-chip :label="formattedMonth" square outline />
      <div class="col-3">
        <q-separator class="bg-grey-7" style="height: 3px;" />
      </div>
    </div>
    <div v-if="daySeparator" class="row full-width">
      <div class="q-pa-sm col-xs-12 col-sm-3 col-md-12 row justify-center">
        <q-chip :label="formattedDay" square color="grey-7" text-color="white" />
      </div>
    </div>
    <div class="row full-width">
      <div v-if="$q.screen.gt.sm" class="col-1" />
      <div v-if="$q.screen.gt.sm" class="col-4">
        <component
          v-if="item.side === 'left'"
          :id="item._id"
          :item="item"
          :is="rendererComponent"
          v-bind="renderer"
        />
      </div>
      <div class="col-xs-12 col-sm-3 col-md-2 q-pa-sm">
        <div class="fit column content-center">
          <div class="col row justify-center"
            v-bind:class="{ 'k-history-line': $q.screen.gt.xs }"
          >
            <q-chip :label="formattedHours" />
          </div>
        </div>
      </div>
      <div class="col-xs-12 col-sm-8 col-md-4">
        <component
          v-if="$q.screen.lt.md || item.side === 'right'"
          :id="item._id"
          :item="item"
          :is="rendererComponent"
          v-bind="renderer"
        />
      </div>
      <div v-if="$q.screen.gt.sm" class="col-1" />
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { baseItem } from '../../mixins'
import { loadComponent } from '../../utils'
import { Time } from '../../time.js'

export default {
  mixins: [baseItem],
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
  computed: {
    formattedMonth () {
      return _.capitalize(this.date.format('MMMM, YYYY'))
    },
    formattedDay () {
      return _.capitalize(Time.format(this.date, 'date.long'))
    },
    formattedHours () {
      return _.capitalize(Time.format(this.date, 'time.long'))
    },
    monthSeparator () {
      if (!this.item.previous) return true
      const previousDate = moment(_.get(this.item.previous, this.dateField))
      if (!this.date.isValid() || !previousDate.isValid()) return true
      if (this.date.year() !== previousDate.year()) return true
      if (this.date.month() !== previousDate.month()) return true
      return false
    },
    daySeparator () {
      if (this.monthSeparator) return true
      const previousDate = moment(_.get(this.item.previous, this.dateField))
      return this.date.date() !== previousDate.date()
    },
    rendererComponent () {
      return loadComponent(this.renderer.component)
    }
  },
  data () {
    return {
      date: moment(_.get(this.item, this.dateField))
    }
  }
}
</script>

<style lang="scss">
  .k-history-line {
    background: linear-gradient($grey-5, $grey-4) no-repeat center/5px 90%;
  }
</style>
