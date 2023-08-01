<template>
  <q-expansion-item icon="las la-question" :label="$t('KSignupAlert.HELP_LABEL')">
    <div class="q-pa-md">
      <i18n-t class="text-body2" keypath="KSignupAlert.HELP_TEXT" tag="p" scope="global" />
    </div>
  </q-expansion-item>
  <q-expansion-item icon="las la-question" :label="$t('KSignupAlert.EMAIL_LABEL')">
    <div class="q-pa-md">
      <i18n-t class="text-body2" keypath="KSignupAlert.EMAIL_TEXT" tag="p" scope="global">
        <template v-slot:email>
          <span class="text-weight-bold">{{ notifierEmail }}</span>
        </template>
      </i18n-t>
    </div>
  </q-expansion-item>
</template>

<script setup>
// Props
defineProps({
  notifierEmail: {
    type: String,
    default: true
  },
})
</script>
