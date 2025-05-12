<template>
  <div class="row" v-if="project">
    <KAction
      id="close-project"
      icon="las la-times"
      :propagate="false"
      @triggered="closeProject" />
    <q-btn-dropdown
      id="project-menu"
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
        <KGrid
          service="projects"
          :base-query="baseQuery"
          :dense="true"
          append-items
          :renderer="renderer"
          @selection-changed="onProjectSelected"
        />
      </template>
    </q-btn-dropdown>
  </div>
</template>

<script>
import _ from 'lodash'
import { KGrid } from '../../../core/client/components'
import { useProject } from '../composables'

export default {
  components: {
    KGrid
  },
  inject: ['kActivity'],
  computed: {
    baseQuery () {
      return {
        _id: { $ne: this.projectId }
      }
    },
    renderer () {
      return {
        component: 'collection/KItem',
        class: 'col-12' // One item per row in menu
      }
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
    },
    onProjectSelected (project) {
      this.$router.push({
        name: this.$route.name,
        query: Object.assign({}, this.$route.query, { project: project._id }),
        params: Object.assign({}, this.$route.params)
      })
    }
  },
  setup (props) {
    return {
      ...useProject()
    }
  }
}
</script>
