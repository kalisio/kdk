<template>
  <div
    class="fit row"
    v-bind:class="{
      'justify-start': alignement === 'left-top' || alignement === 'left-center' || alignement === 'left-bottom',
      'justify-center': alignement === 'center-top' || alignement === 'center-center' || alignement === 'center-bottom',
      'justify-end': alignement === 'right-top' || alignement === 'right-center' || alignement === 'right-bottom',
      'items-start': alignement === 'left-top' || alignement === 'center-top' || alignement === 'right-top',
      'items-center': alignement === 'left-center' || alignement === 'center-center' || alignement === 'right-center',
      'items-end':alignement === 'left-bottom' || alignement === 'center-bottom' || alignement === 'right-bottom',
    }">
    <div
      class="items-center q-gutter-sm"
      v-bind:class="{
        'column justify-center': direction === 'vertical',
        'row': direction === 'horizontal'
      }">
        <q-icon :size="iconSize" :name="iconName" />
        <span v-html="text" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'k-label',
  props: {
    text: {
      type: String,
      defatult: ''
    },
    iconName: {
      type: String,
      default: 'las la-exclamation-circle'
    },
    iconSize: {
      type: String,
      default: '24px'
    },
    direction: {
      type: String,
      default: 'vertical',
      validator: (value) => {
        return ['horizontal', 'vertical'].includes(value)
      }
    },
    alignement: {
      type: String,
      default: 'center-center',
      validator: (value) => {
        return ['left-top', 'center-top', 'right-top', 'left-center', 'center-center', 'right-center', 'left-bottom', 'center-bottom', 'right-bottom'].includes(value)
      }
    }
  }
}
</script>
