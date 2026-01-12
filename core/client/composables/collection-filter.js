import _ from 'lodash'
import moment from 'moment'
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import {
  getCollectionService, getLatestTime, getOldestTime,
  listenToServiceEvents, unlistenToServiceEvents
} from '../utils/index.js'
import { useCurrentActivity } from './activity.js'

export function useCollectionFilter () {
  // Data
  const { CurrentActivityContext } = useCurrentActivity()

  // Computed
  const tagsFilter = computed(() => _.get(CurrentActivityContext.state, 'tagsFilter'))
  const timeFilter = computed(() => _.get(CurrentActivityContext.state, 'timeFilter'))
  const tagsFilterOptions = computed(() => _.get(tagsFilter.value, 'options'))
  const tagsFilterSelection = computed(() => _.get(tagsFilter.value, 'selection'))
  const timeFilterRange = computed(() => _.get(timeFilter.value, 'range'))
  const timeFilterSelection = computed(() => _.get(timeFilter.value, 'selection'))
  const hasTagsFilterOptions = computed(() => !_.isEmpty(tagsFilterOptions.value))
  const hasTagsFilterSelection = computed(() => !_.isEmpty(tagsFilterSelection.value))
  const hasTimeFilterRange= computed(() => {
    const min = timeFilterRange.value?.min
    const max = timeFilterRange.value?.max
    return !_.isEmpty(min) && !_.isEmpty(max) && min !== max
  })
  const hasTimeFilterSelection = computed(() =>
    !_.isEmpty(timeFilterSelection.value?.start) &&
    !_.isEmpty(timeFilterSelection.value?.end)
  )

  // Functions
  function setTagsFilterOptions (options) {
    const tagsFilter = CurrentActivityContext.state.tagsFilter
    _.set(tagsFilter, 'options', options)
  }
  function setTagsFilterSelection (selection) {
    const tagsFilter = CurrentActivityContext.state.tagsFilter
    _.set(tagsFilter, 'selection', selection)
  }
  function setTimeFilterRange (range) {
    const timeFilter = CurrentActivityContext.state.timeFilter
    _.set(timeFilter, 'range', range)
  }
  function setTimeFilterSelection (selection) {
    const timeFilter = CurrentActivityContext.state.timeFilter
    _.set(timeFilter, 'selection', selection)
  }
  function clearTagsFilterSelection () {
    setTagsFilterSelection([])
  }
  function clearTimeFilterSelection () {
    setTimeFilterSelection({ start: null, end: null })
  }

  // Expose
  return {
    tagsFilter,
    timeFilter,
    tagsFilterOptions,
    tagsFilterSelection,
    timeFilterRange,
    timeFilterSelection,
    hasTagsFilterOptions,
    hasTagsFilterSelection,
    hasTimeFilterRange,
    hasTimeFilterSelection,
    setTagsFilterOptions,
    setTagsFilterSelection,
    setTimeFilterRange,
    setTimeFilterSelection,
    clearTagsFilterSelection,
    clearTimeFilterSelection
  }
}

export function useCollectionFilterQuery (options = {}) {
  // Data
  const { CurrentActivityContext } = useCurrentActivity()
  const {
    tagsFilterSelection,
    timeFilterSelection,
    hasTagsFilterSelection,
    hasTimeFilterSelection
  } = useCollectionFilter()
  const filterQuery = ref({})
  let listeners

  // Watch
  watch(tagsFilterSelection, () => refreshFilterQuery(), { immediate: true })
  watch(timeFilterSelection, () => refreshFilterQuery(), { immediate: true })

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
    const tagsFilter = CurrentActivityContext.state.tagsFilter
    const timeFilter = CurrentActivityContext.state.timeFilter
    const timeField = getTimeField()
    // update time filter
    const min = await getOldestTime(getService(), timeField, getBaseQuery())
    const max = await getLatestTime(getService(), timeField, getBaseQuery())
    if (min && max) {
      _.set(timeFilter, 'range', { min, max })
      const timeFilterSelection = _.get(timeFilter, 'selection')
      if (timeFilterSelection) {
        let start = timeFilterSelection.start
        if (start && (((start === 'min') || moment(start).isBefore(min)))) start = min
        let end = timeFilterSelection.end
        if (end && (( end === 'max' || moment(end).isAfter(max)))) end = max
        if (start && end) _.set(timeFilter, 'selection', { start, end })
      }
    }
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
    if (hasTagsFilterSelection.value) {
      const tagFields = getTagFields()
      _.forEach(tagFields, (values, property) => {
        const tagsProperty = _.map(_.filter(tagsFilterSelection.value, { scope: property }), tag => { return tag.name })
        if (!_.isEmpty(tagsProperty)) {
          _.merge(query, { [property]: { $in: tagsProperty } })
        }
      })
    }
    // filter against the selected time range
    if (hasTimeFilterSelection.value) {
      _.merge(query, {
        [getTimeField()]: {
          $gte: timeFilterSelection.value.start,
          $lte: timeFilterSelection.value.end
        }
      })
    }
    filterQuery.value = query
  }

  // Hooks
  onMounted(async () => {
    await refreshOptions()
    listeners = listenToServiceEvents(getService(), {
      created: () => refreshOptions(),
      updated: () => refreshOptions(),
      patched: () => refreshOptions(),
      removed: () => refreshOptions()
    })
  })
  onBeforeUnmount(() => {
    unlistenToServiceEvents(listeners)
  })

  // Expose
  return {
    filterQuery,
    tagsFilterSelection,
    timeFilterSelection,
    hasTagsFilterSelection,
    hasTimeFilterSelection
  }
}
