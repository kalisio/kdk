import _ from 'lodash'
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

// Resolves the max 'to' bound (ISO 8601 duration/time relative to now) among a list of sources.
// Returns null (unbounded) as soon as one source has no 'to' at all.
function getMaxSourceTime (sources, now) {
  const tos = []
  for (const source of sources) {
    if (!source.to) return null
    tos.push(source.to)
  }
  if (!tos.length) return null
  return moment.max(tos.map(to => makeTime(readAsTimeOrDuration(to), now)))
}

// Resolves the newest absolute time a layer can have data for, based on its 'to' properties,
// either its own or underlying grid sources, regarding currently selected forecast model if any.
// Returns null when the layer declares no such bounds, meaning it is never considered out of range.
export function getLayerMaxTime (layer, { now = moment.utc(), model = null } = {}) {
  // treat the root 'to' as a synthetic single source
  const sources = []
  if (layer.to) sources.push({ to: layer.to })
  const timeBasedSources = _.get(layer, 'time_based.sources')
  if (Array.isArray(timeBasedSources)) sources.push(...timeBasedSources)

  let maxTime = null
  if (sources.length) {
    maxTime = getMaxSourceTime(sources, now)
    // an open-ended time_based/root source makes the layer unbounded regardless of the meteo_model bound
    if (!maxTime) return null
  }

  // Having a 'queryFrom' means the layer actually searches backward to have displayable data up to now
  if (layer.queryFrom) maxTime = maxTime ? moment.max(maxTime, now) : now

  const meteoModelMaxTime = getMeteoModelMaxTime(layer, { now, model })
  if (maxTime && meteoModelMaxTime) return moment.max(maxTime, meteoModelMaxTime)
  return maxTime || meteoModelMaxTime || null
}

// Resolves the newest absolute time a layer can have data for a given forecast model, based on
// its 'meteo_model.sources[].to' properties matching that model - each meteo_model source is scoped
// to a specific model (eg. a short-lived high-resolution model vs. a longer-horizon global one), so the
// bound cannot be resolved without knowing which model is currently selected. Returns null when unbounded
// or when the layer declares no meteo_model sources for that model at all.

// Resolves the newest absolute time a layer can have data for based on its underlying meteo grid sources,
// regarding currently selected forecast model if any. Returns null when the layer declares no such bounds.
export function getMeteoModelMaxTime (layer, { now = moment.utc(), model = null } = {}) {
  const sources = _.get(layer, 'meteo_model.sources')
  if (!Array.isArray(sources) || !model) return null
  const matching = sources.filter(source => source.model === model.name)
  if (!matching.length) return null
  return getMaxSourceTime(matching, now)
}
