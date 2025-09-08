import _ from 'lodash'
import { computed } from 'vue'
import { Store } from '../store.js'

const User = Store.getRef('user')

export function useUser () {
  
  // computed
  const name = computed(() => {
    return _.get(User.value, 'profile.name', _.get(User.value, 'profile.username', _.get(User.value, 'email', '')))
  })
  const description = computed(() => {
    return _.get(User.value, 'profile.description', '')
  })
  const avatar = computed(() => {
    return _.get(User.value, 'profile', {})
  })
  const permissions = computed(() => {
    return _.get(User.value, 'permissions')
  })
  const role = computed(() => {
    if (_.isEmpty(permissions.value)) return
    if (_.isString(permissions.value)) return permissions.value
    return permissions.value[0]
  })

  // Expose
  return {
    User,
    name,
    avatar,
    description,
    role
  }
}
