<template>
  <q-icon class="fixed-center k-target" name="las la-plus" :color="color" :size="size" />
</template>

<script>
export default {
  name: 'k-target',
  props: {
    color: {
      type: String,
      default: 'primary'
    },
    size: {
      type: String,
      default: '3rem'
    }
  }
}
</script>

<style lang="stylus">
 .k-target {
    border-radius: 50%;
    background-color: #00000020
 }
</style>