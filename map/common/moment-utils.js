import moment from 'moment'

export function readAsTimeOrDuration (conf) {
  let ret = null
  if (typeof conf === 'string') {
    if (conf.charAt(0) === 'P') {
      // treat as a duration
      ret = moment.duration(conf)
    } else {
      // treat as time
      ret = moment(conf)
    }

    ret = ret.isValid() ? ret : null
  } else if (!conf) {
    ret = moment.duration(0)
  }

  return ret
}

export function makeTime (timeOrDuration, referenceTime) {
  return moment.isDuration(timeOrDuration) ? referenceTime.clone().add(timeOrDuration) : timeOrDuration
}
