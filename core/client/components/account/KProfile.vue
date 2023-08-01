<template>
  <div v-if="User" class="q-pb-md column content-center q-gutter-md bg-grey-4">
    <!-- Header -->
    <KPanel
      id="profile-header"
      :content="header"
      :context="User"
      class="full-width justify-end no-wrap"
      @triggered="onTriggered"
    />
    <!-- Avatar -->
    <div class="row justify-center">
      <KAvatar
        :object="User"
        size="7rem"
      />
    </div>
    <!-- Information -->
    <div class="column">
      <div class="row justify-center text-subtitle1 text-weight-bold">
        {{ User.name }}
      </div>
      <div class="row justify-center">
        {{ User.description }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Store } from '../../store.js'
import KAvatar from '../KAvatar.vue'
import KPanel from '../KPanel.vue'

// Props
const props = defineProps({
  editable: {
    type: Boolean,
    default: true
  },
  manageable: {
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
      tooltip: 'KProfile.MANAGE_ACCOUNT',
      dialog: {
        component: 'account/KAccount',
        okAction: 'CLOSE'
      }
    }
    if (!User.value.isVerified) {
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

// Functions
function onTriggered (args) {
  emit('triggered', args)
}
</script>
