import _ from 'lodash'
import path from 'path'
import makeDebug from 'debug'
import aws from 'aws-sdk'
import store from 's3-blob-store'
import BlobService from 'feathers-blob'
import { createTagService, createStorageService } from '../index.js'
const servicesPath = path.join(__dirname, '..', '..', 'services')
const modelsPath = path.join(__dirname, '..', '..', 'models')

const debug = makeDebug('kdk:core:organisations:service')

export default async function (name, app, options) {
  const config = app.get('storage')
  const client = new aws.S3({
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey
  })
  const bucket = config.bucket
  debug('S3 team storage client created with config ', config)

  return {
    // Hooks that can be added to customize organization services
    organisationServicesHooks: [],

    registerOrganisationServicesHook (hook) {
      if (!this.organisationServicesHooks.includes(hook)) {
        this.organisationServicesHooks.push(hook)
      }
    },

    unregisterOrganisationServicesHook (hook) {
      this.organisationServicesHooks = this.organisationServicesHooks.filter(registeredHook => registeredHook !== hook)
    },

    async createOrganisationServices (organisation, db) {
      this.app.createService('members', {
        servicesPath,
        context: organisation,
        proxy: {
          service: this.app.getService('users'),
          params: { query: { 'organisations._id': organisation._id.toString() } }
        }
      })
      debug('Members service created for organisation ' + organisation.name)
      this.app.createService('groups', {
        modelsPath,
        servicesPath,
        context: organisation,
        db
      })
      debug('Groups service created for organisation ' + organisation.name)
      await createTagService.call(this.app, { context: organisation, db })
      debug('Tags service created for organisation ' + organisation.name)
      const blobStore = store({ client, bucket })
      const blobService = BlobService({ Model: blobStore, id: '_id' })
      await createStorageService.call(this.app, blobService, { context: organisation })
      debug('Storage service created for organisation ' + organisation.name)
      // Run registered hooks
      _.forEach(this.organisationServicesHooks, hook => hook.createOrganisationServices.call(this.app, organisation, db))
    },

    removeOrganisationServices (organisation) {
      // Run registered hooks (reverse order with respect to creation)
      _.forEachRight(this.organisationServicesHooks, hook => hook.removeOrganisationServices.call(this.app, organisation))
    },

    async configureOrganisations () {
      // Reinstanciated services for all organisations
      const organisations = await this.find({ paginate: false })
      organisations.forEach(organisation => {
        // Get org DB
        const db = this.app.db.client.db(organisation._id.toString())
        await this.createOrganisationServices(organisation, db)
      })
    }
  }
}
