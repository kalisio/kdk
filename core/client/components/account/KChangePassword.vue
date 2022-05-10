<template>
  <k-screen :title="$t('KChangePassword.TITLE')">
    <div slot="screen-content">
      <div class="column justify-center sm-gutter">
          <div :class="textClass">
            <p>
              <q-icon name="las la-check" v-show="changed && success"/>
              <q-icon name="las la-exclamation-circle" v-show="changed && !success"/>
              &nbsp;&nbsp;
              {{message}}.
            </p>
            <p v-show="changed && success">
              <q-icon name="las la-arrow-left"/>
              &nbsp;&nbsp;
              <a @click="$router.push({name: 'home'})">
                {{$t('KChangePassword.BACK_LINK')}}
              </a>
            </p>
          </div>
          <div>
            <k-form ref="form" :schema="schema" />
          </div>
          <div>
            <div class="row justify-around">
              <q-btn id="change-password" color="primary" :loading="changing" @click="onChange">
                {{$t('KChangePassword.ACTION')}}
              </q-btn>
            </div>
          </div>
      </div>
    </div>
  </k-screen>
</template>

<script>
import _ from 'lodash'
import { account } from '../../mixins'
import KScreen from '../screen/KScreen.vue'
import KForm from '../form/KForm.vue'

export default {
  name: 'k-change-password',
  components: {
    KScreen,
    KForm
  },
  mixins: [account],
  data () {
    return {
      message: '',
      success: false,
      changed: false,
      changing: false,
      schema: {
        $schema: 'http://json-schema.org/draft-06/schema#',
        $id: 'http://kalisio.xyz/schemas/change-password.json#',
        title: 'Change Password form',
        type: 'object',
        properties: {
          oldPassword: {
            type: 'string',
            field: {
              component: 'form/KPasswordField',
              label: 'KChangePassword.OLD_PASSWORD_FIELD_LABEL'
            }
          },
          password: {
            type: 'string',
            field: {
              component: 'form/KPasswordField',
              label: 'KChangePassword.PASSWORD_FIELD_LABEL'
            }
          },
          confirmPassword: {
            const: {
              $data: '1/password'
            },
            field: {
              component: 'form/KPasswordField',
              label: 'KChangePassword.CONFIRM_PASSWORD_FIELD_LABEL'
            }
          }
        },
        required: ['oldPassword', 'password']
      }
    }
  },
  computed: {
    textClass () {
      const classObject = {}
      if (this.changed) {
        classObject['text-positive'] = this.success
        classObject['text-negative'] = !this.success
      }
      return classObject
    }
  },
  methods: {
    async onChange () {
      const result = this.$refs.form.validate()
      if (result.isValid) {
        try {
          this.changing = true
          await this.changePassword(this.$store.get('user.email'), result.values.oldPassword, result.values.password)
          this.message = this.$t('KChangePassword.SUCCESS_MESSAGE')
          this.success = true
        } catch (error) {
          const type = _.get(error, 'errors.$className')
          switch (type) {
            case 'badParams':
              this.message = this.$t('KChangePassword.ERROR_MESSAGE_BAD_PARAMS')
              break
            default:
              this.message = this.$t('KChangePassword.ERROR_MESSAGE_DEFAULT')
          }
          this.success = false
        }
        this.changing = false
        this.changed = true
      }
    }
  },
  created () {
    // Components initialization
    this.message = this.$t('KChangePassword.MESSAGE')
  }
}
</script>
