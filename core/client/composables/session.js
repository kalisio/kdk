import logger from 'loglevel'
import { computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar, Loading } from 'quasar'
import { api } from '../api.js'
import { i18n } from '../i18n.js'
import { Store } from '../store.js'
import { beforeGuard } from '../guards.js'
import { LocalStorage } from '../local-storage.js'
import { useVersion } from '../composables/version.js'
import { updateAbilities, restoreSession } from '../utils/utils.session.js'
import { defineAbilities } from '../../common/permissions.js'

export function useSession (options = {}) {
  // Data
  const router = useRouter()
  const route = useRoute()
  const $q = useQuasar()
  const { Version } = useVersion()

  let isInitialized = false
  let pendingReconnection = null
  
  // Computed
  const User = computed(() => Store.get('user'))

  // Functions
  function getRedirectKey () {
    return 'redirect'
  }
  async function redirect () {
    // Run registered guards to redirect accordingly if required
    let result = beforeGuard(route)
    // Apply any custom redirection
    if (typeof options.redirect === 'function') result = await options.redirect(route, result, User.value)
    if (typeof result === 'string') {
      // Redirect to a given route based on authentication state
      // If not yet logged in, store target route to restore it after a successful login
      if (result === 'login') {
        LocalStorage.set(getRedirectKey(), _.pick(route, ['name', 'query', 'params']))
        router.push({ name: 'login' })
      } else {
        const targetRoute = LocalStorage.get(getRedirectKey())
        // Once logged in clear target route if any
        if (targetRoute) {
          LocalStorage.clear(getRedirectKey())
          router.push(targetRoute)
        } else {
          router.push({ name: result })
        }
      }
    } else {
      // Clear any previous redirection as we don't have 
      LocalStorage.clear(getRedirectKey())
      if (typeof result === 'object') {
        router.push(result)
      } else if (!result) {
        // This route was previously allowed but due to changes in authorisations it is not anymore
        router.push({ name: (User.value ? 'home' : 'login') })
      }
    }
    // The first time initialize guards after the app has been correctly setup,
    // ie either with or without a restored user
    if (!isInitialized) {
      router.beforeEach(beforeGuard)
      isInitialized = true
    }
  }
  function onReconnectError () {
    // Display it only the first time the error appears because multiple attempts will be tried
    if (!pendingReconnection) {
      logger.error(new Error('Socket has been disconnected'))
      // This will ensure any operation in progress will not keep a "dead" loading indicator
      // as this error might appear under-the-hood without notifying service operations
      Loading.hide()
      pendingReconnection = $q.dialog({
        title: i18n.t('composables.session.ALERT'),
        message: i18n.t('composables.session.DISCONNECT'),
        html: true,
        persistent: true
      }).onDismiss(() => { pendingReconnection = null })
    }
  }
  function onReconnect () {
    // Dismiss pending reconnection error message
    if (pendingReconnection) {
      pendingReconnection.hide()
    }
    // Causes problems with hot reload in dev
    if (Version.flavor !== 'dev') {
      Loading.show({ message: i18n.t('composables.session.RECONNECT') })
      setTimeout(() => { window.location.reload() }, 3000)
    } else {
      logger.error(new Error('Socket disconnected, not trying to reconnect automatically in development mode please refresh page manually'))
    }
  }
  function onRateLimit () {
    $q.dialog({
      title: i18n.t('composables.session.ALERT'),
      message: i18n.t('composables.session.REFUSED'),
      html: true,
      ok: {
        label: i18n.t('composables.session.RETRY'),
        flat: true
      }
    }).onOk(() => window.location.reload())
  }

  // Watch
  watch(User, async () => { 
    await updateAbilities()
    await redirect() 
  })

  // Hooks
  onMounted(async () => {
    // Handle socket connexion
    if (api.socket) {
      // Display error message if we cannot contact the server
      api.socket.io.on('reconnect_error', onReconnectError)
      // Handle reconnection correctly, otherwise auth seems to be lost
      // Also easier to perform a full refresh instead of handling this specifically on each activity
      api.socket.io.on('reconnect', onReconnect)
      // Display error message if we have been banned from the server
      api.socket.on('rate-limit', onRateLimit)
    }

    try { 
      await restoreSession()
    } catch (error) {
      await redirect()
    }
  })

  onBeforeUnmount(() => {
    if (api.socket) {
      api.socket.off('reconnect_error', onReconnectError)
      api.socket.off('reconnect', onReconnect)
      api.socket.off('rate-limit', onRateLimit)
    }
  })

  // Expose
  return {
    User,
    redirect,
    onReconnectError,
    onReconnect,
    onRateLimit
  }
}
