<template>
  <div v-if="User" class="full-width column">
    <!-- Header -->
    <KPanel
      id="profile-header"
      :content="header"
      :context="User"
      class="q-py-sm full-width justify-end no-wrap"
      @triggered="onTriggered"
    />
    <!-- Avatar -->
    <div v-if="avatar && computedAvatar" class="q-py-sm column items-center">
      <KAvatar
        :subject="computedAvatar"
        size="5rem"
      />
    </div>
    <!-- Information -->
    <div class="q-py-sm column items-center">
      <div class="text-subtitle1 text-weight-medium">
        {{ computedName }}
      </div>
      <div v-if="description && computedDescription" class="text-caption">
        {{ computedDescription }}
      </div>
    </div>
    <!-- Role -->
    <div v-if="role && computedRole" class="q-py-sm column items-center">
      <KChip
        color="primary"
        text-color="white"
        square
        size=".85rem"
        :label="$t(`Roles.${computedRole}`)"
      />
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { computed } from 'vue'
import { Store } from '../../store.js'
import KAvatar from '../KAvatar.vue'
import KPanel from '../KPanel.vue'
import KChip from '../KChip.vue'

// Props
const props = defineProps({
  editable: {
    type: Boolean,
    default: true
  },
  manageable: {
    type: Boolean,
    default: true
  },
  avatar: {
    type: Boolean,
    default: true
  },
  description: {
    type: Boolean,
    default: true
  },
  role: {
    type: Boolean,
    default: true
  }
})

// Emit
const emit = defineEmits(['triggered'])

// Data
const User = Store.getRef('user')

// Computed
const header = computed(() => {
  const actions = []
  if (props.editable) {
    actions.push({
      id: 'edit-profile',
      icon: 'las la-edit',
      size: '0.75rem',
      tooltip: 'KProfile.EDIT_PROFILE',
      dialog: {
        component: 'editor/KEditor',
        service: 'users',
        objectId: User.value._id,
        perspective: 'profile',
        hideButtons: true,
        cancelAction: 'CANCEL',
        okAction: {
          id: 'ok-button',
          label: 'APPLY',
          handler: 'apply'
        }
      }
    })
  }
  if (props.manageable) {
    const manageAccountAction = {
      id: 'manage-account',
      icon: 'las la-cog',
      size: '0.75rem',
      tooltip: 'KProfile.MANAGE_ACCOUNT',
      dialog: {
        component: 'account/KAccount',
        okAction: 'CLOSE'
      }
    }
    if (_.has(User.value, 'isVerified') && !User.value.isVerified) {
      manageAccountAction.badge = {
        rounded: true,
        floating: true,
        class: 'q-ma-sm',
        color: 'red',
        icon: { name: 'fas fa-exclamation', size: '8px' }
      }
    }
    actions.push(manageAccountAction)
  }
  return actions
})
const computedName = computed(() => {
  return _.get(User.value, 'profile.name', '')
})
const computedDescription = computed(() => {
  return _.get(User.value, 'profile.description', '')
})
const computedAvatar = computed(() => {
  return _.get(User.value, 'profile', {})
})
const computedRole = computed(() => {
  const permissions = _.get(User.value, 'permissions')
  if (permissions) {
    if (_.isString(permissions)) return permissions
    return permissions[0]
  }
})

// Functions
function onTriggered (args) {
  emit('triggered', args)
}
</script>
