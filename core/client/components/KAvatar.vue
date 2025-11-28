<template>
  <div>
    <q-avatar v-if="avatar" :size="size">
      <q-img :src="avatar" />
      <q-tooltip v-if="tooltip">
        {{ name }}
      </q-tooltip>
    </q-avatar>
    <q-avatar v-else-if="icon" :size="size" :color="color" text-color="white" :icon="icon">
      <q-tooltip v-if="tooltip">
        {{ name }}
      </q-tooltip>
    </q-avatar>
    <q-avatar v-else-if="initials" :size="size" color="primary" text-color="white">
      {{ initials }}
      <q-tooltip v-if="tooltip">
        {{ name }}
      </q-tooltip>
    </q-avatar>
  </div>
</template>

<script>
import _ from 'lodash'
import { Storage } from '../storage.js'
import { getIconName, getInitials } from '../utils/index.js'

export default {
  props: {
    subject: {
      type: Object,
      required: true
    },
    size: {
      type: String,
      default: 'md'
    },
    tooltip: {
      type: Boolean,
      default: false
    },
    options: {
      type: Object,
      default: () => null
    }
  },
  data () {
    return {
      name: null,
      avatar: null,
      icon: null,
      initials: null,
      color: 'primary'
    }
  },
  watch: {
    subject: {
      immediate: true,
      async handler () {
        this.name = this.getName()
        // Process avatar first
        const avatar = this.getAvatar()
        if (avatar) {
          if (avatar.uri) {
            this.avatar = avatar.uri
            return
          }
          // Backward compatibility as avatar key was previously stored under _id
          const avatarId = _.get(avatar, 'key', _.get(avatar, '_id'))
          if (avatarId) {
            /* FIXME: download does not seem to work due to a base64 decoding issue
            const data = await Storage.download({
              file: _.get(avatar, 'name'),
              key: avatarId,
              asDataUrl: true
            })
            avatar.uri = data.uri
            this.avatar = avatar.uri
            */
            const options = {
              file: _.get(avatar, 'name'),
              key: avatarId,
              query: {
                timestamp: Date.now()
              },
              ...(this.options.context && { context: this.options.context })
            }
            this.avatar = await Storage.getObjectUrl(options)
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
          return
        }
        this.icon = null
        // Process name third
        const name = this.getName()
        if (name) {
          this.initials = getInitials(name)
          return
        }
        this.initials = null
      }
    }
  },
  methods: {
    getAvatar () {
      const avatarField = _.get(this.options, 'avatarField', 'avatar')
      return _.get(this.subject, avatarField)
    },
    getIcon () {
      const iconField = _.get(this.options, 'iconField', 'icon')
      return _.get(this.subject, iconField)
    },
    getName () {
      const nameField = _.get(this.options, 'nameField', 'name')
      return _.get(this.subject, nameField)
    }
  }
}
</script>
