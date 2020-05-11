<template>
  <k-page padding>
    <template v-slot:page-content>
      <!--
        Members collection, cannot use smart strategy here because membership is not managed at service level
        but using authorisations on users
      -->
      <k-grid ref="subscribersGrid" service="subscribers" :renderer="renderer" :contextId="contextId" :base-query="baseQuery" :filter-query="searchQuery" />
      <!--
        Router view to enable routing to modals
      -->
      <router-view service="subscribers" :router="router()"></router-view>
    </template>
  </k-page>
</template>

<script>
import _ from 'lodash'
import mixins from '../../mixins'
import { getRoleForOrganisation } from '../../../common/permissions'

export default {
  name: 'k-subscribers-activity',
  mixins: [mixins.baseActivity],
  props: {
    contextId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      baseQuery: {
        subscriber: true,
        $sort: {
          'profile.name': 1
        }
      },
      renderer: {
        component: 'team/KSubscriberCard',
        props: {
          options: {
            tags: 'chip',
            avatar: { size: '40px' }
          }
        }
      }
    }
  },
  methods: {
    router () {
      return {
        onApply: { name: 'subscribers-activity', params: { contextId: this.contextId } },
        onDismiss: { name: 'subscribers-activity', params: { contextId: this.contextId } }
      }
    },
    refreshActivity () {
      this.clearActivity()
      // Title
      this.setTitle(this.$store.get('context.name'))
      // Search bar
      this.setSearchBar('profile.name', [
        { service: 'groups', field: 'name', baseQuery: {}, icon: { name: 'las la-sitemap' } },
        { service: 'tags', field: 'value', baseQuery: {}, icon: 'las la-tag' }
      ])
      // Tabbar actions
      this.registerTabAction({
        name: 'members',
        label: this.$t('KSubscribersActivity.MEMBERS_LABEL'),
        icon: 'las la-user-friends',
        route: { name: 'members-activity', params: { contextId: this.contextId } },
        default: true
      })
      this.registerTabAction({
        name: 'subscribers',
        label: this.$t('KSubscribersActivity.SUBSCRIBERS_LABEL'),
        icon: 'las la-address-book',
        route: { name: 'subscribers-activity', params: { contextId: this.contextId } }
      })
      this.registerTabAction({
        name: 'groups',
        label: this.$t('KSubscribersActivity.GROUPS_LABEL'),
        icon: 'las la-sitemap',
        route: { name: 'groups-activity', params: { contextId: this.contextId } }
      })
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-page'] = this.$load('layout/KPage')
    this.$options.components['k-grid'] = this.$load('collection/KGrid')
  }
}
</script>
