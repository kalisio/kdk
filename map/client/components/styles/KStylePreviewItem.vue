<template>
  <KItem ref="item">
    <template v-slot:item-content>
      <div class="row">
        <q-item-label>{{ name }}</q-item-label>
        <KStylePreview class="q-ml-md" type="point" :options="style" />
        <KStylePreview class="q-ml-md" type="line" :options="style" />
        <KStylePreview class="q-ml-md" type="polygon" :options="style" />
      </div>
    </template>
  </KItem>
</template>
<script setup>
import { ref, computed } from 'vue'
import _ from 'lodash'
import KItem from '../../../../core/client/components/collection/KItem.vue'
import KStylePreview from './KStylePreview.vue'
import { DefaultStyle } from '../../utils/index.js'

const item = ref(null)

const name = computed(() => {
  return _.get(item, 'value.item.name', '')
})

const style = computed(() => {
  return _.get(item, 'value.item', _.pick(DefaultStyle, ['point', 'line', 'polygon']))
})

</script>
