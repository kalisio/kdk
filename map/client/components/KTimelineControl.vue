<template>
  <div class="row justify-between">
    <div class="row q-gutter-sm">
      <q-btn round icon='fas fa-step-backward' color="secondary" @click="onClickBackward"/>
      <q-btn round icon='fas fa-step-forward' color="secondary" @click="onClickForward"/>
    </div>
    <!--
    <q-fab icon='keyboard_arrow_left' direction='left' color="secondary">
      <q-fab-action color='secondary' icon='fas fa-sync' />
      <q-fab-action color='secondary' icon='event' />
      <q-fab-action color='secondary' icon='access_time' />
    </q-fab>
    -->
    <div class="row q-gutter-sm">
      <q-btn round icon='fas fa-sync' color="secondary" @click="onClickReset"/>
      <q-btn round icon='fas fa-calendar' color="secondary">
        <q-popup-proxy transition-show="scale" transition-hide="scale">
          <q-input filled v-model="controlDateTime">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="controlDate" :mask="qdateMask" today-btn/>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="controlTime" :mask="qtimeMask" now-btn format24h/>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </q-popup-proxy>
      </q-btn>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  name: 'k-timeline-control',
  inject: ['kActivity'],
  data () {
    return {
      qdateMask: 'YYYY-MM-DD',
      qtimeMask: 'HH:mm',
      qinputFormat: '',
      reference: moment().utc()
    }
  },
  computed: {
    controlDate: {
      get: function () {
        return this.reference.format(this.qdateMask)
      },
      set: function (value) {
        const date = moment.utc(value, this.qdateMask)
        date.minute(this.reference.minute())
        date.hour(this.reference.hour())
        this.updateReference(date)
      }
    },
    controlTime: {
      get: function () {
        return this.reference.format(this.qtimeMask)
      },
      set: function (value) {
        const time = moment.utc(value, this.qtimeMask)
        time.date(this.reference.date())
        time.month(this.reference.month())
        time.year(this.reference.year())
        this.updateReference(time)
      }
    },
    controlDateTime: {
      get: function () {
        return this.reference.format(this.qinputFormat)
      },
      set: function (value) {
        const datetime = moment.utc(value, this.qinputformat)
        this.updateReference(datetime)
      }
    }
  },
  methods: {
    updateReference (newref) {
      this.reference = newref
      this.kActivity.centerTimeline(newref)
    },
    onClickForward (event) {
      const currentTime = this.kActivity.currentTime.clone()
      currentTime.add(this.kActivity.timeline.step)
      this.kActivity.setCurrentTime(currentTime)
    },
    onClickBackward (event) {
      const currentTime = this.kActivity.currentTime.clone()
      currentTime.subtract(this.kActivity.timeline.step)
      this.kActivity.setCurrentTime(currentTime)
    },
    onClickReset (event) {
      this.kActivity.resetTimeline()
    },
    onTimelineChanged (timeline) {
      if (timeline.reference.isSame(this.reference)) return
      this.reference = timeline.reference.clone()
    }
  },
  mounted () {
    this.kActivity.$on('timeline-changed', this.onTimelineChanged)
  },
  beforeDestroy () {
    this.kActivity.$off('timeline-changed', this.onTimelineChanged)
  }
}
</script>
