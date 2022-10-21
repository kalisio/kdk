import moment from 'moment'

export function readAsTimeOrDuration (conf) {
  let ret = null
  if (typeof conf === 'string') {
    if (conf.charAt(0) === 'P') {
      // treat as a duration
      ret = moment.duration(conf)
    } else {
      // treat as time
      ret = moment.utc(conf)
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

export function floorTo(time, period) {
  const timeAsMs = time.valueOf()
  const periodAsMs = period.asMilliseconds()
  const adj = Math.floor(timeAsMs / periodAsMs) * periodAsMs
  return moment(adj)
}

export function ceilTo(time, period) {
  const timeAsMs = time.valueOf()
  const periodAsMs = period.asMilliseconds()
  const adj = Math.ceil(timeAsMs / periodAsMs) * periodAsMs
  return moment(adj)
}
