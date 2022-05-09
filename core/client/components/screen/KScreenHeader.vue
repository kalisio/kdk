<template>
  <div class="row justify-center">
    {{ $t(flavor) }}
  </div>
</template>

<script>
export default {
  name: 'k-screen-header',
  computed: {
    flavor () {
      if (this.$config('flavor') === 'prod') return ''
      else if (this.$config('flavor') === 'test') return 'KScreen.TEST_VERSION'
      else return 'KScreen.DEVELOPMENT_VERSION'
    }
  }
}
</script>
