<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    {{ model }}
  </div>
  <div v-else>
    <q-input v-if="mode === 'input'"
      :for="properties.name + '-field'"
      :id="properties.name + '-field'"
      type="number"
      v-model.number="model"
      :label="label"
      :disable="disabled"
      :clearable="clearable"
      :error="hasError"
      :error-message="errorLabel"
      bottom-slot
      @blur="onChanged"
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
            style="border-radius: 50%;"
          >
              <KCompass
                v-model="model"
                :indicator="false"
                @update:model-value="onChanged"
                class="k-compass"
              />
          </q-popup-proxy>
        </KAction>
      </template>
      <!-- Helper -->
      <template v-if="helper" v-slot:hint>
        <span v-html="helper"></span>
      </template>
    </q-input>
    <q-field v-else
      :for="properties.name + '-field'"
      :id="properties.name + '-field'"
      :ref="onReferenceCreated"
      :label="label"
      stack-label
      v-model="model"
      :error-message="errorLabel"
      :error="hasError"
      :disable="disabled"
      :clearable="clearable"
      bottom-slots
      borderless
      @clear="onCleared">
      <!-- control -->
      <template v-slot:control>
        <KCompass
          v-model="model"
          @update:model-value="onChanged"
          class="k-compass"
        />
      </template>
      <!-- Helper -->
      <template v-if="helper" v-slot:hint>
        <span v-html="helper"></span>
      </template>
    </q-field>
  </div>

</template>

<script>
import _ from 'lodash'
import { mixins as kdkCoreMixins } from '../../../../core/client'
import KCompass from '../KCompass.vue'

export default {
  components: {
    KCompass
  },
  mixins: [kdkCoreMixins.baseField],
  computed: {
    mode () {
      return _.get(this.properties.field, 'mode', 'input')
    },
    clearable () {
      return _.get(this.properties.field, 'clearable', false)
    }
  },
  methods: {
    emptyModel () {
      return null
    },
    onCleared () {
      this.model = null
    }
  }
}
</script>

<style lang="scss">
.k-compass {
  padding: 8px;
  width: 130px;
  height: 130px;
}
</style>
