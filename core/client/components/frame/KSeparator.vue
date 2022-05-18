<template>
  <div v-if="direction === 'horizontal'" class="row full-width justify-center">
    <q-separator :style="`width: ${width};`"  />
  </div>
  <div v-else class="row content-center">
    <q-separator :style="`height: ${height};`" vertical />
  </div>
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
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '100%'
    }
  }
}
</script>
