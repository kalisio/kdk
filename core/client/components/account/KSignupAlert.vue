<template>
  <q-dialog
    v-model="isVisible"
    persistent
    full-width
    position="bottom">
    <q-card class="bg-warning q-pa-sm">
      <q-toolbar>
        <q-toolbar-title>
          {{$t('KSignupAlert.TITLE')}}
        </q-toolbar-title>
        <q-btn id="close-signup-alert" icon="las la-times" flat dense round v-close-popup />
      </q-toolbar>
      <q-expansion-item icon="las la-question" :label="$t('KSignupAlert.HELP_LABEL')">
        <div class="q-pa-md bg-warning">
          <i18n-t class="text-body2" keypath="KSignupAlert.HELP_TEXT" tag="p" scope="global" />
        </div>
      </q-expansion-item>
      <q-expansion-item icon="las la-question" :label="$t('KSignupAlert.EMAIL_LABEL')">
        <div class="q-pa-md bg-warning">
          <i18n-t class="text-body2" keypath="KSignupAlert.EMAIL_TEXT" tag="p" scope="global">
            <template v-slot:email>
              <span class="text-weight-bold">{{ notifierEmail }}</span>
            </template>
          </i18n-t>
        </div>
      </q-expansion-item>
      <q-card-actions align="right">
        <q-btn flat color="black" :label="$t('KSignupAlert.ACTION')" @click="resendVerifySignup(accountEmail)" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { account } from '../../mixins'

export default {
  mixins: [account],
  props: {
    isVerified: {
      type: Boolean,
      required: true
    },
    accountEmail: {
      type: String,
      required: true
    },
    notifierEmail: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isVisible: false
    }
  },
  created () {
    this.isVisible = !this.isVerified
  }
}
</script>
