<template>
  <div class="row justify-start items-center q-gutter-sm">
    <template v-for="tag in tags">
      <q-chip
        :key="tag.value"
        :color="getColor(tag)"
        text-color="white"
        dense
        outline
        square>
        <q-icon v-if="tag.icon.name" :name="tag.icon.name" class="q-mr-xs" />
        {{ tag.value }}
      </q-chip>
    </template>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'k-tags-pane',
  props: {
    tags: {
      type: Array,
      required: true
    }
  },
  methods: {
    getColor (tag) {
      return _.isEmpty(tag.icon.color) ? 'grey-7' : tag.icon.color
    }
  }
}
</script>
