<template>
  <div v-if="readOnly" :id="properties.name + '-field'">
    <template v-for="(chip, index) in model">
      <q-chip
        :key="chip.value + '-' + index"
        :icon="chip.icon.name"
        :color="chip.icon.color"
        outline
        dense>
        {{chip.value}}
      </q-chip>
    </template>
  </div>
  <div v-else>
    <q-field
      :for="properties.name + '-field'"
      :label="label"
      :error-message="errorLabel"
      :error="hasError"
      :disabled="disabled"
      no-error-icon
      bottom-slots
    >
      <template v-slot:default>
        <div class="row items-baseline q-gutter-sm">
          <div v-if="tags.length > 0">
            <template v-for="(tag, index) in tags">
              <q-chip
                :key="tag.value + '-' + index "
                :icon="tag.icon.name"
                :color="tag.icon.color"
                :label="tag.value"
                :clickable="!tag._id"
                outline
                dense
                @remove="onTagRemoved(tag)"
                @click="onTagClicked(tag)"
                removable />
            </template>
          </div>
          <div>
            <k-autocomplete
              :id="properties.name + '-field'"
              ref="search"
              :services="services"
              :borderless="true"
              :clearable="false"
              :process-results="processResults"
              @changed="onTagAdded" />
          </div>
        </div>
      </template>

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
import { Store } from '../../store'
import { KAutocomplete, KIconChooser } from '../input'
import mixins from '../../mixins'

export default {
  name: 'k-tag-field',
  components: {
    KAutocomplete,
    KIconChooser
  },
  mixins: [mixins.baseField],
  data () {
    return {
      services: [{
        service: 'tags',
        baseQuery: { scope: this.properties.scope },
        field: 'value',
        icon: { name: 'label', color: 'faded' }
      }],
      tags: []
    }
  },
  methods: {
    emptyModel () {
      return []
    },
    fill (value) {
      this.model = value
      // Update tags as well but only those of current context as tag service can be contextual
      const context = Store.get('context')
      this.partition = _.partition(this.model, { context: _.get(context, '_id') })
      this.tags = this.partition[0]
    },
    processResults (pattern, results) {
      // We always add first an entry to create a new tag
      if (_.findIndex(results, result => result.value === pattern) === -1) {
        results.unshift({
          label: this.$t('KTagField.CREATE_TAG', { tag: pattern }),
          icon: 'send',
          value: pattern,
          data: {
            value: pattern,
            scope: this.properties.scope,
            icon: { name: '', color: 'black' }
          }
        })
      }
    },
    onTagAdded (newTag) {
      if (typeof newTag === 'string') return
      if (_.findIndex(this.tags, tag => tag.value === newTag.value) === -1) {
        // Filter the required tag data
        const tag = _.pick(newTag, ['_id', 'value', 'scope', 'icon'])
        this.tags.push(tag)
        this.updateModel()
      }
    },
    onTagRemoved (oldTag) {
      this.tags = this.tags.filter(tag => tag.value !== oldTag.value)
      this.updateModel()
    },
    updateModel () {
      // filter rendering properties only
      this.model = _.concat(this.tags, this.partition[1])
      this.onChanged()
    },
    onTagClicked (tag) {
      this.selectedTag = tag
      this.$refs.iconChooser.open(tag.icon)
    },
    onIconChoosed (icon) {
      this.selectedTag.icon = icon
      this.updateModel()
    }
  }
}
</script>
