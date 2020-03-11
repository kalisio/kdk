<template>
  <k-modal ref="modal" :title="$t('KInviteMember.TITLE')" :toolbar="getToolbar()" :buttons="getButtons()" :route="true">
    <div slot="modal-content">
      <q-tabs  align="justify" v-model="mode" inverted>
        <q-tab name="unique" icon="person"  />
        <q-tab name="multiple" icon="people"  />
      </q-tabs>
      <div>
        <q-tab-panels v-model="mode" animated>
          <q-tab-panel name="unique">
            <k-form ref="form" :schema="getSchema()" />
          </q-tab-panel>
          <q-tab-panel name="multiple">
            <q-field
              :error-message="fileErrorLabel"
              :error="fileError">
                <k-file-input
                  :mime-types="['txt/csv', 'application/vnd.ms-excel']"
                  :clearable="true"
                  @cleared="onInputFileCleared"
                  @rejected="onInputFileRejected"
                  @failed="onInputFileFailed"
                  @loaded="onInputFileLoaded" />
              <template v-slot:hint>
                <span v-html="$t('KInviteMember.FILE_FIELD_HELPER')"></span>
              </template>
            </q-field>
          </q-tab-panel>
        </q-tab-panels>
      </div>
    </div>
  </k-modal>
</template>

<script>
import { Dialog } from 'quasar'
import { mixins, utils } from '../../mixins'
import { RoleNames } from '../../../common/permissions'
import Papa from 'papaparse'

export default {
  name: 'k-invite-member',
  mixins: [
    kCoreMixins.refsResolver(['form'])
  ],
  props: {
    contextId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      mode: 'unique',
      fileError: false,
      fileErrorLabel: '',
      fileContent: ''
    }
  },
  methods: {
    getSchema () {
      return {
        $schema: 'http://json-schema.org/draft-06/schema#',
        $id: 'http://kalisio.xyz/schemas/invite-member',
        title: 'Invite Member Form',
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 3,
            maxLength: 128,
            field: {
              component: 'form/KTextField',
              helper: 'KInviteMember.NAME_FIELD_HELPER'
            }
          },
          email: {
            type: 'string',
            format: 'email',
            field: {
              component: 'form/KEmailField',
              helper: 'KInviteMember.EMAIL_FIELD_HELPER'
            }
          },
          role: {
            type: 'string',
            default: 'member',
            field: {
              component: 'form/KSelectField',
              helper: 'KInviteMember.ROLE_FIELD_HELPER',
              type: 'radio',
              options: [
                { label: this.$t('KInviteMember.MEMBER_LABEL'), value: 'member' },
                { label: this.$t('KInviteMember.MANAGER_LABEL'), value: 'manager' },
                { label: this.$t('KInviteMember.OWNER_LABEL'), value: 'owner' }
              ]
            }
          }
        },
        required: ['name', 'email', 'role']
      }
    },
    getToolbar () {
      return [
        { name: 'close-action', label: this.$t('KInviteMember.CLOSE_ACTION'), icon: 'close', handler: () => this.doClose() }
      ]
    },
    getButtons () {
      return [
        { name: 'invite-button', label: this.$t('KInviteMember.INVITE_BUTTON'), color: 'primary', handler: () => this.doInvite() }
      ]
    },
    doInvite (event, done) {
      if (this.mode === 'unique') {
        const result = this.$refs.form.validate()
        if (result.isValid) this.doInviteUnique(result.values, done)
        else done()
      } else {
        if (this.fileContent !== '') {
          const result = Papa.parse(this.fileContent, { skipEmptyLines: true })
          this.doInviteMultiple(result.data, done)
        } else {
          this.fileError = true
          done()
        }
      }
    },
    async doInviteUnique (data, done) {
      // Add the locale information
      data.locale = utils.getLocale()
      // Add the sponsor information
      data.sponsor = {
        id: this.$store.get('user._id'),
        organisationId: this.contextId,
        roleGranted: data.role
      }
      // Remove the role from the form data
      delete data.role
      // Create the user
      const usersService = this.$api.getService('users')
      await usersService.create(data)
      done()
      this.doClose()
    },
    async doInviteMultiple (data, done) {
      const errors = []
      const guests = []
      const emailExpr = /\S+@\S+\.\S+/
      for (let i = 0; i < data.length; i++) {
        const record = data[i]
        if (record.length === 3 && emailExpr.test(record[1]) && RoleNames.includes(record[2])) {
          const guest = {
            locale: utils.getLocale(),
            sponsor: {
              id: this.$store.get('user._id'),
              organisationId: this.contextId,
              roleGranted: record[2]
            },
            name: record[0],
            email: record[1]
          }
          guests.push(guest)
        } else {
          const error = {
            line: i + 1,
            record: record
          }
          errors.push(error)
        }
      }
      if (guests.length === 0) {
        Dialog.create({
          title: this.$t('KInviteMember.ALERT_FILE_IMPORT_DIALOG'),
          message: this.$t('KInviteMember.ALERT_FILE_IMPORT_MESSAGE'),
          html: true,
          ok: {
            label: this.$t('OK')
          }
        }).onOk(() => done())
      } else if (errors.length > 0) {
        Dialog.create({
          title: this.$t('KInviteMember.CONFIRM_FILE_IMPORT_DIALOG'),
          message: this.$t('KInviteMember.CONFIRM_FILE_IMPORT_MESSAGE', { errors: errors.length, records: data.length }),
          html: true,
          ok: {
            label: this.$t('OK')
          },
          cancel: {
            label: this.$t('KInviteMember.CANCEL_BUTTON')
          }
        }).onOk(async () => {
          const usersService = this.$api.getService('users')
          for (let i = 0; i < guests.length; ++i) await usersService.create(guests[i])
          done()
          this.doClose()
        }).onCancel(() => done())
      } else {
        const usersService = this.$api.getService('users')
        for (let i = 0; i < guests.length; ++i) await usersService.create(guests[i])
        done()
        this.doClose()
      }
    },
    doClose () {
      this.$refs.modal.close()
      this.$router.push({ name: 'members-activity' })
    },
    onInputFileCleared () {
      this.fileError = false
      this.fileContent = ''
    },
    onInputFileRejected (file) {
      this.fileError = true
      this.fileErrorLabel = this.$t('KInviteMember.INVALID_FILE_TYPE')
    },
    onInputFileFailed (file) {
      this.fileError = true
      this.fileErrorLabel = this.$t('KInviteMember.ERROR_WHILE_LOADING_THE_FILE')
    },
    onInputFileLoaded (file, content) {
      this.fileError = false
      this.fileContent = content
    }
  },
  created () {
    // Load the required components
    this.$options.components['k-modal'] = this.$load('frame/KModal')
    this.$options.components['k-form'] = this.$load('form/KForm')
    this.$options.components['k-file-input'] = this.$load('input/KFileInput')
  }
}
</script>
