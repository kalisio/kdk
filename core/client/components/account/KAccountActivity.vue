<template>
  <k-page v-if="user" padding>
    <template v-slot:page-content>
      <div v-if="page === 'profile'">
        <k-editor service="users" :objectId="user._id" perspective="profile" />
      </div>
      <div v-if="page === 'security'">
        <k-account-security :device-renderer="deviceRenderer" />
      </div>
      <div v-else-if="page === 'danger-zone'">
        <k-account-dz />
      </div>
    </template>
  </k-page>
</template>

<script>
import _ from 'lodash'
import { baseActivity } from '../../mixins'
import KPage from '../layout/KPage.vue'
import KEditor from '../editor/KEditor.vue'
import KAccountSecurity from './KAccountSecurity.vue'
import KAccountDZ from './KAccountDZ.vue'

export default {
  name: 'account-activity',
  components: {
    KPage,
    KEditor,
    KAccountSecurity,
    KAccountDZ
  },
  mixins: [ baseActivity() ],
  props: {
    page: {
      type: String,
      required: true,
      validator: (value) => {
        return ['profile', 'security', 'danger-zone'].indexOf(value) !== -1
      }
    }
  },
  data () {
    return {
      user: this.$store.get('user'),
      // Make this configurable from app
      deviceRenderer: _.merge({
        component: 'account/KDeviceCard'
      }, this.activityOptions.devices)
    }
  },
  watch: {
    page: function (value) {
      this.setTopPaneMode(value)
    }
  }
}
</script>
