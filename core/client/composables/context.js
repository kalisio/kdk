import logger from 'loglevel'
import { useRouter } from 'vue-router'
import { readonly } from 'vue'
import { Dialog } from 'quasar'
import { Context } from '../context.js'
import { i18n } from '../i18n.js'
import { listenToServiceEvents, unlistenToServiceEvents } from '../utils/utils.services.js'

export function useContext (options) {
  // Data
  const router = useRouter()
  const fallbackRoute = options?.fallbackRoute || 'home'
  let serviceEventListeners

  // Functions
  function getService () {
    return Context.getService()
  }
  async function setContext (objectOrId) {
      // clear context if any
    let context = Context.get()
    if (context) untrack()
    // set context
    if (_.isString(objectOrId)) {
      // load context
      const service = Context.getService()
      try {
        logger.debug(`[KDK] Setting context to '${objectOrId}'`)
        context = await service.get(objectOrId)
      } catch (error) {
        logger.debug(`[KDK] cannot get event with id ${objectOrId}: ${error}`)
        setTimeout(() => router.push({ name: fallbackRoute }), 2000)
      }
    } else if (_.isObject(objectOrId)) {
      // assign context
      logger.debug(`[KDK] Setting context to '${objectOrId._id}'`)
      context = objectOrId
    } else {
      // raise an error
      logger.error('[KDK] Setting context: invalid parameter', objectOrId)
      return
    }
    Context.set(context)
    track()    
  }
  function clearContext () {
    if (Context.get()) untrack()
    Context.set(null)
  }
  function track () {
    serviceEventListeners = listenToServiceEvents(Context.getService(), {
      patched: onPatched,
      removed: onRemoved
    })
  }
  function untrack () {
    unlistenToServiceEvents(serviceEventListeners)
  }
  function onPatched (data) {
    const context = Context.get()
    if (context._id === data._id) {
      Object.assign(context, _.omit(data, ['_id']))
    }
  }
  function onRemoved (data) {
    const context = Context.get()    
    if (context._id === data._id) {
      Dialog.create({
        title: i18n.t('ALERT'),
        message: i18n.t('composables.context.REMOVED_MESSAGE'),
        persistent: true,
        position: 'bottom',
        html: true,
        backdropFilter: 'blur(4px)',
        ok: {
          label: i18n.t('OK'),
          flat: true
        }
      }).onOk(async () => {
        router.push({ name: fallbackRoute })
      })
    }
  }

  // Expose
  return {
    Context: readonly(Context.getRef('store')),
    getService,
    setContext,
    clearContext
  }
}
