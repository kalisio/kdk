<template>
  <div>
    <q-skeleton v-if="skeleton" type="QAvatar" :size="size" />
    <q-avatar v-if="avatar" :size="size">
      <img :src="avatar">
      <q-tooltip v-if="name">
        {{ name }}
      </q-tooltip>
    </q-avatar>
    <q-avatar v-else-if="icon" :size="size" :color="color" text-color="white" :icon="icon">
      <q-tooltip v-if="name">
        {{ name }}
      </q-tooltip>
    </q-avatar>
    <q-avatar v-else-if="initials" :size="size" color="primary" text-color="white">
      {{ initials }}
      <q-tooltip v-if="name">
        {{ name }}
      </q-tooltip>
    </q-avatar>
  </div>
</template>

<script>
import _ from 'lodash'
import { QSkeleton } from 'quasar'
import { getIconName, getInitials } from '../../utils.js'

export default {
  name: 'k-avatar',
  components: {
    QSkeleton
  },
  props: {
    object: {
      type: Object,
      required: true
    },
    contextId: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: 'md'
    },
    options: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      skeleton: true,
      name: null,
      avatar: null,
      icon: null,
      initials: null,
      color: 'primary'
    }
  },
  watch: {
    object: {
      immediate: true,
      async handler () {
        this.name = this.getName()
        // Process avatar first
        const avatar = this.getAvatar()
        if (avatar) {
          if (avatar.uri) {
            this.avatar = avatar.uri
            this.skeleton = false
            return
          }
          const avatarId = _.get(avatar, '_id')
          if (avatarId) {
            const data = await this.$api.getService('storage', this.contextId).get(avatarId + '.thumbnail')
            avatar.uri = data.uri
            this.avatar = avatar.uri
            this.skeleton = false
            return
          }
          this.avatar = null
        }
        this.avatar = null
        // Process icon second
        const icon = this.getIcon()
        if (icon) {
          this.icon = getIconName(icon, 'name')
          this.color = _.get(icon, 'color', 'primary')
          this.skeleton = false
          return
        }
        this.icon = null
        // Process name third
        const name = this.getName()
        if (name) {
          this.initials = getInitials(name)
          this.skeleton = false
          return
        }
        this.initials = null
        this.skeleton = false
      }
    }
  },
  methods: {
    getAvatar () {
      const avatarField = _.get(this.options, 'avatarField', 'avatar')
      return _.get(this.object, avatarField)
    },
    getIcon () {
      const iconField = _.get(this.options, 'iconField', 'icon')
      return _.get(this.object, iconField)
    },
    getName () {
      const nameField = _.get(this.options, 'nameField', 'name')
      return _.get(this.object, nameField)
    }
  }
}
</script>
