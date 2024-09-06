<template>
  <KModal
    id="add-member-modal"
    :title="$t('KAddMember.TITLE')"
    v-model="isModalOpened"
  >
    <div>
      <q-tabs  align="justify" v-model="mode" inverted>
        <q-tab id="unique-tab" name="unique" icon="las la-user"  />
        <q-tab id="multiple-tab" name="multiple" icon="las la-user-friends"  />
      </q-tabs>
      <div>
        <q-tab-panels v-model="mode" animated>
          <q-tab-panel name="unique" class="q-pa-none">
            <div v-if="step === 1">
              <k-form
                key="emailForm"
                class="q-pt-lg q-pb-lg"
                ref="userEmailForm"
                :schema="getUserEmailSchema()" />
              <div class="row justify-end q-gutter-x-sm">
                <k-action
                  id="cancel-button"
                  label="KAddMember.CANCEL_BUTTON"
                  renderer="form-button"
                  :outline="true"
                  :handler="() => this.closeModal()" />
                <k-action
                  id="continue-button"
                  label="KAddMember.CONTINUE_BUTTON"
                  :loading="waiting"
                  renderer="form-button"
                  :handler="onContinueClicked" />
              </div>
            </div>
            <div v-else>
              <div class="q-pt-lg" v-html="message" />
              <k-form
                key="propertiesForm"
                class="q-pt-lg q-pb-lg"
                ref="userPropertiesForm"
                :schema="getUserPropertiesSchema()" />
              <div class="row justify-start q-gutter-x-sm">
                <k-action
                  id="back-button"
                  label="KAddMember.BACK_BUTTON"
                  :outline="true"
                  renderer="form-button"
                  :handler="() => { step = 1 }" />
                <q-space />
                <k-action
                  id="cancel-button"
                  label="KAddMember.CANCEL_BUTTON"
                  renderer="form-button"
                  :outline="true"
                  :handler="() => this.closeModal()" />
                <k-action
                  id="add-button"
                  :label="user ? 'KAddMember.ADD_BUTTON' : 'KAddMember.INVITE_BUTTON'"
                  :loading="waiting"
                  renderer="form-button"
                  :handler="onAddUniqueClicked" />
              </div>
            </div>
          </q-tab-panel>
          <q-tab-panel name="multiple" class="q-pa-none">
            <k-form
              class="q-pt-lg q-pb-lg"
              ref="usersFileForm"
              :schema="getUsersFileSchema()" />
            <div class="row justify-end">
              <k-action
                id="add-button"
                label="KAddMember.ADD_BUTTON"
                :loading="waiting"
                renderer="form-button"
                :handler="onAddMultipleClicked" />
            </div>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </KModal>
</template>

<script>
import _ from 'lodash'
import { Dialog, exportFile } from 'quasar'
import { baseModal } from '../../mixins'
import { getLocale } from '../../utils'
import { api } from '../../api.js'
import { Store } from '../../store.js'
import { i18n } from '../../i18n.js'
import { RoleNames } from '../../../common/permissions'
import KModal from '../KModal.vue'
import KForm from '../form/KForm.vue'
import KAction from '../action/KAction.vue'

export default {
  emits: ['opened', 'closed'],
  components: {
    KModal,
    KForm,
    KAction
  },
  mixins: [
    baseModal
  ],
  props: {
    contextId: {
      type: String,
      required: true
    }
  },
  computed: {
    message () {
      if (this.user) return this.$t('KAddMember.ADD_MESSAGE', { email: this.user.email })
      return this.$t('KAddMember.INVITE_MESSAGE', { email: this.email })
    }
  },
  data () {
    return {
      user: null,
      email: null,
      users: [],
      mode: 'unique',
      step: 1,
      waiting: false
    }
  },
  methods: {
    getUserEmailSchema () {
      return {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: 'http://kalisio.xyz/schemas/user-email',
        type: 'object',
        properties: {
          email: {
            type: 'string',
            format: 'email',
            field: {
              component: 'form/KEmailField',
              label: 'KAddMember.EMAIL_FIELD_LABEL'
            }
          }
        },
        required: ['email']
      }
    },
    getUserPropertiesSchema () {
      const name = {
        type: 'string',
        minLength: 3,
        maxLength: 128,
        default: this.user ? _.get(this.user, 'profile.name') : '',
        field: {
          component: 'form/KTextField',
          label: this.user ? '' : 'KAddMember.NAME_FIELD_LABEL',
          disabled: this.user
        }
      }
      const role = {
        type: 'string',
        default: 'member',
        field: {
          component: 'form/KRoleField',
          label: 'KAddMember.ROLE_FIELD_LABEL',
          default: 'member'
        }
      }
      if (this.user) {
        return {
          $schema: 'http://json-schema.org/draft-07/schema#',
          $id: 'http://kalisio.xyz/schemas/user-properties',
          type: 'object',
          properties: {
            role
          },
          required: ['role']
        }
      }
      return {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: 'http://kalisio.xyz/schemas/user-properties',
        type: 'object',
        properties: {
          name,
          role
        },
        required: ['name', 'role']
      }
    },
    getUsersFileSchema () {
      return {
        $schema: 'http://json-schema.org/draft-07/schema#',
        $id: 'http://kalisio.xyz/schemas/users-file',
        type: 'object',
        properties: {
          file: {
            type: 'object',
            field: {
              component: 'form/KFileField',
              label: 'KAddMember.FILE_FIELD_LABEL',
              mimeTypes: '.csv,text/csv'
            }
          }
        },
        required: ['file']
      }
    },
    async onContinueClicked () {
      this.waiting = true
      this.user = null
      this.email = null
      const result = this.$refs.userEmailForm.validate()
      if (result.isValid) {
        const usersService = this.$api.getService('users')
        const response = await usersService.find({ query: { email: result.values.email } })
        if (response.total === 1) {
          // Check whether the user belong to the organisation
          const user = response.data[0]
          if (_.find(user.organisations, { _id: this.contextId })) {
            this.$refs.userEmailForm.getField('email').error = this.$t('KAddMember.ALREADY_MEMBER_ERROR')
          } else {
            this.user = user
            this.step = 2
          }
        } else {
          this.email = result.values.email
          this.step = 2
        }
      }
      this.waiting = false
    },
    async onAddUniqueClicked () {
      this.waiting = true
      const result = this.$refs.userPropertiesForm.validate()
      if (result.isValid) {
        if (this.user) {
          // Add the person
          const authorisationService = this.$api.getService('authorisations')
          await authorisationService.create({
            scope: 'organisations',
            permissions: result.values.role,
            subjects: this.user._id,
            subjectsService: 'users',
            resource: this.contextId,
            resourcesService: 'organisations'
          })
        } else {
          // Invite the person
          const guest = {
            locale: getLocale(),
            email: this.email,
            name: result.values.name,
            sponsor: {
              id: this.$store.get('user._id'),
              organisationId: this.contextId,
              roleGranted: result.values.role
            }
          }
          const usersService = this.$api.getService('users')
          await usersService.create(guest)
        }
        this.waiting = false
        this.closeModal()
      }
    },
    async onAddMultipleClicked () {
      this.waiting = true
      const result = this.$refs.usersFileForm.validate()
      if (result.isValid) {
        const fileContent = result.values.file.content
        const errors = {}
        const records = []
        const emailExpr = /\S+@\S+\.\S+/
        for (let i = 0; i < fileContent.length; i++) {
          const fileRecord = fileContent[i]
          if (fileRecord.length === 3) {
            const name = _.trim(fileRecord[0])
            const email = _.trim(fileRecord[1])
            const role = _.trim(fileRecord[2])
            if (name.length > 2 && emailExpr.test(email) && RoleNames.includes(role)) {
              const record = {
                name,
                email,
                role
              }
              records.push(record)
            } else {
              errors[i + 1] = this.$t('KAddMember.INVALID_FIELDS_VALUES_ERROR')
            }
          } else {
            errors[i + 1] = this.$t('KAddMember.INVALID_FIELDS_NUMBER_ERROR')
          }
        }
        if (records.length === 0) {
          exportFile('errors.json', JSON.stringify(errors, null, '\t'))
          Dialog.create({
            message: this.$t('KAddMember.ALERT_FILE_IMPORT_MESSAGE'),
            ok: {
              label: this.$t('OK'),
              flat: true
            }
          })
        } else if (!_.isEmpty(errors)) {
          exportFile('errors.json', JSON.stringify(errors, null, '\t'))
          Dialog.create({
            message: this.$t('KAddMember.CONFIRM_FILE_IMPORT_MESSAGE', { errors: _.keys(errors).length, records: fileContent.length }),
            html: true,
            ok: {
              label: this.$t('KAddMember.CONTINUE_BUTTON'),
              flat: true
            },
            cancel: {
              label: this.$t('CANCEL'),
              flat: true
            }
          }).onOk(async () => {
            this.processRecords(records)
            this.closeModal()
          })
        } else {
          this.processRecords(records)
          this.closeModal()
        }
      }
      this.waiting = false
    },
    async processRecords (records) {
      const report = {}
      for (let i = 0; i < records.length; i++) {
        const record = records[i]
        report[record.name] = await this.processRecord(record, this.contextId)
      }
      exportFile('report.json', JSON.stringify(report, null, '\t'))
    },
    async processRecord (record, contextId) {
      // Check whether the guest has already an acount
      const usersService = api.getService('users')
      const response = await usersService.find({ query: { email: record.email } })
      if (response.total === 1) {
        // Check whether the user belong to the organisation
        const user = response.data[0]
        if (_.find(user.organisations, { _id: contextId })) return i18n.t('KAddMember.ALREADY_MEMBER_ERROR')
        // Add the person
        const authorisationService = api.getService('authorisations')
        await authorisationService.create({
          scope: 'organisations',
          permissions: record.role,
          subjects: user._id,
          subjectsService: 'users',
          resource: contextId,
          resourcesService: 'organisations'
        })
        return i18n.t('KAddMember.USER_ADDED_MESSAGE')
      } else {
        const guest = {
          locale: getLocale(),
          sponsor: {
            id: Store.get('user._id'),
            organisationId: contextId,
            roleGranted: record.role
          },
          name: record.name,
          email: record.email
        }
        await usersService.create(guest)
        return i18n.t('KAddMember.GUEST_ADDED_MESSAGE')
      }
    }
  },
  created () {
    // Init the file contet
    this.fileContent = undefined
  }
}
</script>
