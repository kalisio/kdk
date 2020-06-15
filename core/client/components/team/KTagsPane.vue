<template>
  <div class="row justify-start items-center q-gutter-sm">
    <template v-for="tag in tags">
      <q-badge
        :key="tag.value"
        :color="tag.icon.color"
        text-color="white"
        outline>
        <q-icon v-if="tag.icon.name" :name="tag.icon.name" class="q-mr-xs" />
        {{ tag.value }}
      </q-badge>
    </template>
  </div>
</template>

<script>
export default {
  name: 'k-tags-pane',
  props: {
    tags: {
      type: Array,
      required: true
    }
  }
}
</script>
