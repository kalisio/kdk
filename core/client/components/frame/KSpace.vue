<template>
  <q-space></q-space>
</template>

<script>
export default {
  props: {
    direction: {
      type: String,
      default: 'horizontal',
      validator: (value) => {
        return ['horizontal', 'vertical'].includes(value)
      }
    }
  }
}
</script>