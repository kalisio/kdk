<template>
  <div>
    <!-- Forms section -->
    <k-form
      ref="form"
      :schema="formSchema"
    />
    <!-- Buttons section -->
    <q-card-actions align="right">
      <KPanel
        id="modal-buttons"
        :content="buttons"
        renderer="form-button"
        v-bind:class="{ 'q-gutter-x-md' : $q.screen.gt.xs, 'q-gutter-x-sm': $q.screen.lt.sm }"
      />
    </q-card-actions>
  </div>
</template>

<script>
import { KPanel, KForm } from '../../../../core/client/components'
import { baseModal } from '../../../../core/client/mixins'

export default {
  components: {
    KPanel,
    KForm
  },
  emits: [
    'done'
  ],
  inject: ['kActivity'],
  data () {
    return {
      creating: false
    }
  },
  computed: {
    buttons () {
      return [{
        id: 'close-action',
        outline: true,
        label: 'CLOSE',
        renderer: 'form-button',
        handler: this.onClose
      }, {
        id: 'create-view-action',
        label: 'CREATE',
        loading: this.creating,
        renderer: 'form-button',
        handler: this.onCreate
      }]
    },
    formSchema () {
      return {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: 'http://www.kalisio.xyz/schemas/favorite-view.create.json#',
        description: 'Map view creation schema',
        type: 'object',
        properties: {
          name: {
            type: 'string',
            maxLength: 128,
            minLength: 3,
            field: {
              component: 'form/KTextField',
              label: 'KCreateView.NAME_FIELD_LABEL'
            }
          },
          description: {
            type: 'string',
            maxLength: 256,
            field: {
              component: 'form/KTextField',
              label: 'KCreateView.DESCRIPTION_FIELD_LABEL'
            }
          },
          layers: {
            type: 'boolean',
            default: false,
            field: {
              component: 'form/KToggleField',
              label: 'KCreateView.LAYERS_FIELD_LABEL'
            }
          }
        },
        required: ['name']
      }
    }
  },
  methods: {
    onClose () {
      this.$emit('done')
    },
    async onCreate () {
      const result = this.$refs.form.validate()
      if (result.isValid) {
        const view = result.values
        try {
          this.creating = true
          await this.kActivity.saveContext(view)
          this.creating = false
          this.$emit('done')
        } catch (error) {
          this.creating = false
          this.$emit('done')
          throw error
        }
      }
    }
  }
}
</script>
