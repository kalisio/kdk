<template>
  <q-card>
    <!--
      Title section
     -->
    <q-card-section v-if="title" class="k-block-title text-subtitle1">
      {{ title }}
    </q-card-section>
    <!--
      Content section
      -->
    <q-card-section>
      <div class="column k-block-content">
        <!-- Text -->
        <div class="k-block-text" v-html="text" />
        <!-- Action -->
        <div v-if="action" class="self-end">
          <KAction v-bind="action" />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import KAction from './action/KAction.vue'

export default {
  components: {
    KAction
  },
  props: {
    title: {
      type: String,
      default: undefined
    },
    text: {
      type: String,
      default: ''
    },
    action: {
      type: Object,
      default: () => null
    },
    color: {
      type: String,
      default: 'grey'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
  .k-block-title {
    background-color: v-bind(color)
  }
  .k-block-content {
    margin: 8px;
  }
  .k-block-text {
    padding: 8px;
  }
</style>
