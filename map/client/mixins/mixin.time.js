import _ from 'lodash'
import moment from 'moment'

export default {
  data () {
    return {
      currentTime: moment.utc(),
      currentTimeFormat: this.$store.get('timeFormat')
    }
  },
  computed: {
    currentFormattedTime () {
      return {
        time: {
          short: this.formatTime('time.short'),
          long: this.formatTime('time.long')
        },
        date: {
          short: this.formatTime('date.short'),
          long: this.formatTime('date.long')
        },
        year: {
          short: this.formatTime('year.short'),
          long: this.formatTime('year.long')
        },
        iso: this.formatTime('iso')
      }
    }
  },
  methods: {
    convertToMoment (datetime) {
      if (moment.isMoment(datetime)) {
        // Clone to avoid mutating and force UTC mode
        return moment.utc(datetime.valueOf())
      } else { // Convert from Date, string or milliseconds (ie EPOCH)
        return moment.utc(datetime)
      }
    },
    setCurrentTime (datetime) {
      const now = this.convertToMoment(datetime)
      if (this.currentTime.isSame(now)) return
      this.currentTime = now
      this.$emit('current-time-changed', this.currentTime)
    },
    formatTime (format, datetime) {
      let currentTime = (datetime ? this.convertToMoment(datetime) : this.currentTime)
      if (!this.currentTimeFormat.utc) {
        // Convert to local time
        currentTime = moment(currentTime.valueOf())
      }
      currentTime.locale(this.currentTimeFormat.locale)
      if (format === 'iso') return currentTime.format()
      // Defaults to long mode if not given
      else return currentTime.format(_.get(this.currentTimeFormat, format, _.get(this.currentTimeFormat, format + '.long')))
    }
  }
}
