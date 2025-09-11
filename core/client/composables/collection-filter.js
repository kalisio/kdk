import _ from 'lodash'
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { getCollectionService, getLatestTime, getOldestTime, listenToServiceEvents, unlistenToServiceEvents } from '../utils/index.js'
import { useCurrentActivity } from './activity.js'

export function useCollectionFilter () {
  // Data
  const { CurrentActivityContext } = useCurrentActivity()

  // Computed
  const tagsFilter = computed(() => _.get(CurrentActivityContext.state, 'tagsFilter'))
  const timeFilter = computed(() => _.get(CurrentActivityContext.state, 'timeFilter'))

  // Functions
  function setTagsFilter (value, scope) {
    const tagsFilter = CurrentActivityContext.state.tagsFilter
    if (!tagsFilter) return
    if (scope) _.set(tagsFilter, scope, value)
    else Object.assign(tagsFilter, value)
  }
  function setTimeFilter (value, scope) {
    const timeFilter = CurrentActivityContext.state.timeFilter
    if (!timeFilter) return
    if (scope) _.set(timeFilter, scope, value)
    else Object.assign(timeFilter, value)
  }
  function clearTagsFilter () {
    setTagsFilter([], 'selection')
  }
  function cleatTimeFilter () {
    setTimeFilter({ start: null, end: null })
  }

  // Expose
  return {
    tagsFilter,
    timeFilter,
    setTagsFilter,
    setTimeFilter,
    clearTagsFilter,
    cleatTimeFilter
  }
}

export function useCollectionFilterQuery (options = {}) {
  // Data
  const { CurrentActivityContext } = useCurrentActivity()
  const tagsFilter = CurrentActivityContext.state.tagsFilter
  const timeFilter = CurrentActivityContext.state.timeFilter
  const filterQuery = ref({})
  let listeners

  // Computed
  const selectedTags = computed(() => {
    return _.get(tagsFilter, 'selection', [])
  })
  const hasTagsSelection = computed(() => {
    return !_.isEmpty(selectedTags.value)
  })
  const selectedTime = computed(() => {
    return _.cloneDeep(timeFilter)
  })
  const hasTimeSelection = computed(() => {
    const start = _.get(timeFilter, 'start')
    const end = _.get(timeFilter, 'end')
    return start && end && start !== end
  })

  // Watch
  watch(selectedTags, () => refreshFilterQuery(), { immediate: true })
  watch(selectedTime, (newTimeRange, oldTimeRange) => {
    if (oldTimeRange && oldTimeRange.start !== null && oldTimeRange.end !== null) refreshFilterQuery()
  }, { deep: true })

  // Functions
  function getService () {
    return getCollectionService(options.service.value, options.context ? options.context.value : null)
  }
  function getBaseQuery () {
    return _.get(options, 'baseQuery.value', {})
  }
  function getTimeField () {
    return _.get(options, 'timeField.value', 'createdAt')
  }
  function getTagFields () {
    return _.get(options, 'tagFields', [])
  }
  async function refreshOptions () {
    const timeField = getTimeField()
    // update time filter
    const min = await getOldestTime(getService(), timeField, getBaseQuery())
    if (min) _.set(timeFilter, 'min', min)
    const max = await getLatestTime(getService(), timeField, getBaseQuery())
    if (max) _.set(timeFilter, 'max', max)
    // update tags filter
    const tagFields = getTagFields()
    let tagsOptions = []
    _.forEach(tagFields, (values, property) => {
      const propertyOptions = _.map(values, (state, key) => {
        return _.merge({ scope: property, name: key }, state)
      })
      if (_.size(propertyOptions) > 1) tagsOptions = _.concat(tagsOptions, propertyOptions)
    })
    _.set(tagsFilter, 'options', tagsOptions)
  }
  function refreshFilterQuery () {
    const query = {}
    // filter against the selected tags
    if (hasTagsSelection.value) {
      const tagFields = getTagFields()
      _.forEach(tagFields, (values, property) => {
        const tagsProperty = _.map(_.filter(selectedTags.value, { scope: property }), tag => { return tag.name })
        if (!_.isEmpty(tagsProperty)) {
          _.merge(query, { [property]: { $in: tagsProperty } })
        }
      })
    }
    // filter against the selected time range
    if (hasTimeSelection.value) {
      _.merge(query, {
        [getTimeField()]: {
          $gte: selectedTime.value.start,
          $lte: selectedTime.value.end
        }
      })
    }
    filterQuery.value = query
  }

  // Hooks
  onMounted(async () => {
    await refreshOptions()
    listeners = listenToServiceEvents(getService(), {
      created: () => refreshOptions('created'),
      updated: () => refreshOptions('updated'),
      patched: () => refreshOptions('patched'),
      removed: () => refreshOptions('removed')
    })
  })
  onBeforeUnmount(() => {
    unlistenToServiceEvents(listeners)
  })

  // Expose
  return {
    filterQuery,
    hasTagsSelection,
    hasTimeSelection
  }
}
