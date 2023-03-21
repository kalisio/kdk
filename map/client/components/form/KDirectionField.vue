<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    {{ model }}
  </div>
  <q-input v-else
    :for="properties.name + '-field'"
    type="number"
    v-model.number="model"
    :label="label"
    clearable
    :disable="disabled"
    :error="hasError"
    :error-message="errorLabel"
    bottom-slot
    @blue="onChanged"
    @update:model-value="onChanged"
  >
    <!-- compass -->
    <template v-slot:append>
      <KAction
        id="compass"
        tooltip="KDirectionField.COMPASS"
        icon="las la-compass"
        color="grey-8"
        dense
      >
        <q-popup-proxy
          anchor="top middle"
          self="bottom middle"
        >
          <div class="k-compass">
            <KCompass
              v-model="model"
            />
          </div>
        </q-popup-proxy>
      </KAction>
    </template>
    <!-- Helper -->
    <template v-if="helper" v-slot:hint>
      <span v-html="helper"></span>
    </template>
  </q-input>
</template>

<script>
import { mixins as kdkCoreMixins } from '../../../../core/client'
import KCompass from '../KCompass.vue'

export default {
  components: {
    KCompass
  },
  mixins: [kdkCoreMixins.baseField]
}
</script>

<style lang="scss">
.k-compass {
  padding: 8px;
  border-radius: 10px;
  background-color: lightgray;
  width: 220px;
  height: 220px;
}
</style>
