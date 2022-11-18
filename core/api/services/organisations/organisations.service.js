import path, { dirname } from 'path'
import makeDebug from 'debug'
import { createTagService, createStorageService } from '../index.js'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const servicesPath = path.join(__dirname, '..', '..', 'services')
const modelsPath = path.join(__dirname, '..', '..', 'models')

const debug = makeDebug('kdk:core:organisations:service')

export default async function (name, app, options) {
  const config = app.get('storage')
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
      await this.app.createService('members', {
        servicesPath,
        context: organisation,
        proxy: {
          service: this.app.getService('users'),
          params: { query: { 'organisations._id': organisation._id.toString() } }
        }
      })
      debug('Members service created for organisation ' + organisation.name)
      await this.app.createService('groups', {
        modelsPath,
        servicesPath,
        context: organisation,
        db
      })
      debug('Groups service created for organisation ' + organisation.name)
      await createTagService.call(this.app, { context: organisation, db })
      debug('Tags service created for organisation ' + organisation.name)
      await createStorageService.call(this.app, { context: organisation })
      debug('Storage service created for organisation ' + organisation.name)
      // Run registered hooks
      for (let i = 0; i < this.organisationServicesHooks.length; i++) {
        const hook = this.organisationServicesHooks[i]
        await hook.createOrganisationServices.call(this.app, organisation, db)
      }
    },

    async removeOrganisationServices (organisation) {
      // Run registered hooks (reverse order with respect to creation)
      for (let i = this.organisationServicesHooks.length - 1; i >= 0; i--) {
        const hook = this.organisationServicesHooks[i]
        await hook.removeOrganisationServices.call(this.app, organisation)
      }
    },

    async configureOrganisations () {
      // Reinstanciated services for all organisations
      const organisations = await this.find({ paginate: false })
      organisations.forEach(organisation => {
        debug('Configuring organisation ' + organisation.name)
        // Get org DB
        const db = this.app.db.client.db(organisation._id.toString())
        this.createOrganisationServices(organisation, db)
      })
    }
  }
}
