<template>
  <KAction
    v-if="project"
    id="close-project"
    icon="las la-times"
    :propagate="false"
    @triggered="closeProject" />
  <q-btn-dropdown v-if="project"
    class="q-pl-sm ellipsis-2-lines"
    :label="label"
    :size="size"
    flat
    dense
    no-caps
    square
    menu-anchor="bottom middle"
    menu-self="top middle">
    <template v-slot:default>
      <q-card v-if="project" class="bg-white" :style="computedStyle">
      </q-card>
    </template>
  </q-btn-dropdown>
</template>

<script>
import _ from 'lodash'
import { useProject } from '../composables'

export default {
  inject: ['kActivity'],
  computed: {
    computedStyle () {
      if (this.$q.screen.lt.sm) return 'min-width: 100vw;'
      if (this.$q.screen.lt.md) return 'min-width: 80vw;'
      if (this.$q.screen.lt.lg) return 'min-width: 60vw;'
      if (this.$q.screen.lt.xl) return 'min-width: 40vw;'
      return 'min-width: 20vw;'
    },
    label () {
      return (this.$q.screen.gt.sm && this.project ? this.project.name : '')
    },
    color () {
      return _.get(this.project, 'icon.color', 'grey-7')
    },
    size () {
      return this.$q.screen.lt.sm ? 'sm' : 'md'
    }
  },
  data () {
    return {
      organisation: this.$store.get('context')
    }
  },
  watch: {
    projectId: {
      async handler () {
        await this.loadProject()
      }
    }
  },
  methods: {
    closeProject () {
      this.$router.push({
        name: this.$route.name,
        query: _.omit(this.$route.query, ['project']),
        params: this.$route.params
      })
    }
  },
  setup (props) {
    return {
      ...useProject({ contextId: props.contextId })
    }
  }
}
</script>
