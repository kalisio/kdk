<template>
  <div>
    <div v-if="readOnly" :id="properties.name + '-field'">
      <template v-for="(chip, index) in model">
        <q-chip
          :key="chipValue(chip) + '-' + index"
          :icon="chipIcon(chip)"
          :color="chipColor(chip)"
          outline
          dense>
          {{chipValue(chip)}}
        </q-chip>
      </template>
    </div>
    <q-field v-else
      :for="properties.name + '-field'"
      :value="chips"
      :label="label"
      :error-message="errorLabel"
      :error="hasError"
      :disabled="disabled"
      bottom-slots
    >
      <!-- Content -->
      <template v-slot:default>
        <div class="row items-baseline">
          <template v-for="(chip, index) in chips">
            <q-chip
              :id="'chip-' + index"
              class="chip"
              :key="chipValue(chip) + '-' + index"
              :icon="chipIcon(chip)"
              :color="chipColor(chip)"
              @remove="onChipRemoved(chip)"
              @click="onChipClicked(chip)"
              clickable
              removable
              outline
              dense
            >
              {{chip.value}}
            </q-chip>
          </template>
          <q-input class="q-pl-sm col-grow" :for="properties.name + '-field'" autofocus type="text" v-model="input" :after="inputActions" @keyup.enter="onChipAdded()" />
        </div>
      </template>
      <!-- Helper -->
      <template v-if="helper" v-slot:hint>
        <span v-html="helper"></span>
      </template>
    </q-field>
    <k-icon-chooser
      ref="iconChooser"
      @icon-choosed="onIconChoosed" />
  </div>
</template>

<script>
import _ from 'lodash'
import { KIconChooser } from '../input'
import mixins from '../../mixins'
import { getIconName } from '../../utils'

export default {
  name: 'k-chips-with-icon-field',
  components: {
    KIconChooser
  },
  mixins: [mixins.baseField],
  computed: {
    inputActions () {
      const actions = []
      if (_.findIndex(this.chips, { value: this.input }) === -1) {
        actions.push({
          icon: 'send',
          content: true,
          handler: () => this.onChipAdded()
        })
      }
      actions.push({
        icon: 'cancel',
        content: true,
        handler: () => { this.input = '' }
      })
      return actions
    }
  },
  data () {
    return {
      input: '',
      chips: []
    }
  },
  methods: {
    emptyModel () {
      return []
    },
    fill (value) {
      this.model = value
      this.chips = this.model.slice()
    },
    chipIcon (chip) {
      return getIconName(chip)
    },
    chipColor (chip) {
      return _.get(chip, 'icon.color', 'primary')
    },
    chipValue (chip) {
      return chip.value || chip.name
    },
    onChipAdded () {
      const chip = {
        value: this.input,
        icon: {
          name: _.get(this.properties.field, 'icon.name', ''),
          color: _.get(this.properties.field, 'icon.color', 'black')
        }
      }
      this.chips.push(chip)
      this.input = ''
      this.updateModel()
    },
    onChipRemoved (oldChip) {
      this.chips = this.chips.filter(chip => chip.value !== oldChip.value)
      this.updateModel()
    },
    onChipClicked (chip) {
      this.selectedChip = chip
      this.$refs.iconChooser.open(chip.icon)
    },
    onIconChoosed (icon) {
      this.selectedChip.icon = Object.assign({}, icon)
      this.updateModel()
    },
    updateModel () {
      // filter rendering properties only
      this.model = this.chips
      this.onChanged()
    }
  }
}
</script>

<style>
.chip {
  cursor: pointer;
}
</style>
