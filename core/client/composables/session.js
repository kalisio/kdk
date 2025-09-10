import _ from 'lodash'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar, Loading } from 'quasar'
import { api } from '../api.js'
import { i18n } from '../i18n.js'
import { Events } from '../events.js'
import { beforeGuard } from '../guards.js'
import { LocalStorage } from '../local-storage.js'
import { restoreSession } from '../utils/utils.session.js'
import { useUser } from './user.js'

export function useSession (options = {}) {
  // Data
  const { User } = useUser()
  const disconnectKey = 'disconnect-dialog'
  const reconnectKey = 'reconnect-dialog'
  const router = useRouter()
  const route = useRoute()
  const $q = useQuasar()

  const isInitialized = ref(false)
  let pendingReconnection = null
  let pendingReload = null
  let ignoreReconnectionError = false

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
        // When hitting the root domain we should let standard redirection occur
        if (route.path !== '/') LocalStorage.set(getRedirectKey(), _.pick(route, ['name', 'query', 'params']))
        await router.push({ name: 'login' })
      } else {
        const targetRoute = LocalStorage.get(getRedirectKey())
        // Once logged in clear target route if any
        if (targetRoute) {
          LocalStorage.clear(getRedirectKey())
          await router.push(targetRoute)
        } else {
          await router.push({ name: result })
        }
      }
    } else {
      // Clear any previous redirection as we don't have
      LocalStorage.clear(getRedirectKey())
      if (typeof result === 'object') {
        await router.push(result)
      } else if (!result) {
        // This route was previously allowed but due to changes in authorisations it is not anymore
        await router.push({ name: (User.value ? 'home' : 'login') })
      }
    }
    // The first time initialize guards after the app has been correctly setup,
    // ie either with or without a restored user and a redirection
    if (!isInitialized.value) {
      if (router) router.beforeEach(beforeGuard)
      isInitialized.value = true
    }
  }
  function onReconnectError () {
    // Dismiss pending reload message if any
    if (pendingReload) {
      pendingReload.hide()
      pendingReload = null
    }
    // Display it only the first time the error appears because multiple attempts will be tried
    if (!pendingReconnection && !ignoreReconnectionError) {
      // This will ensure any operation in progress will not keep a "dead" loading indicator
      // as this error might appear under-the-hood without notifying service operations
      Loading.hide()
      // Disconnect prompt can be avoided, eg in tests
      if (!LocalStorage.get(disconnectKey, true)) {
        // We flag however that we are waiting for reconnection to avoid emitting the event multiple times
        pendingReconnection = true
        return
      }
      pendingReconnection = $q.dialog({
        title: i18n.t('composables.session.ALERT'),
        message: i18n.t('composables.session.DISCONNECT'),
        html: true,
        persistent: true,
        cancel: {
          id: 'ignore-button',
          label: i18n.t('composables.session.IGNORE'),
          color: 'primary',
          outline: true
        },
        ok: {
          id: 'close-button',
          label: i18n.t('CLOSE'),
          color: 'primary'
        },
        position: 'bottom'
      })
      .onOk(() => {
        pendingReconnection = null
        ignoreReconnectionError = false
      })
      .onCancel(() => {
        pendingReconnection = null
        ignoreReconnectionError = true
      })
    }
  }
  function onReconnect () {
    // Dismiss pending reconnection error message if any
    if (pendingReconnection) {
      // If reconnection prompt is avoided we simply have a boolean flag instead of a dismiss dialog function
      if (typeof pendingReconnection.hide === 'function') pendingReconnection.hide()
      pendingReconnection = null
    }
    ignoreReconnectionError = false
    // Display it only the first time the reconnection occurs because multiple attempts will be tried
    if (!pendingReload) {
      // Reconnect prompt can be avoided, eg in tests
      if (!LocalStorage.get(reconnectKey, true)) return
      pendingReload = $q.dialog({
        title: i18n.t('composables.session.INFORMATION'),
        message: i18n.t('composables.session.RECONNECT'),
        html: true,
        cancel: {
          id: 'ignore-button',
          label: i18n.t('composables.session.IGNORE'),
          color: 'primary',
          outline: true
        },
        ok: {
          id: 'update-button',
          label: i18n.t('composables.session.RELOAD'),
          color: 'primary'
        },
        position: 'bottom'
      })
      .onOk(() => { window.location.reload() })
      .onCancel(() => { pendingReload = null })
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
      },
      position: 'bottom'
    })
    .onOk(() => window.location.reload())
  }

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
    // Then redirection
    Events.on('user-abilities-changed', redirect)
    api.on('logout', async () => {
      // Used to automatically redirect when the user has requested a logout from another client
      // We don't use redirect() here as in this case the user is already logout and it would redirect to login instead
      if (typeof options.logout === 'function') result = await options.logout()
      else if (typeof options.logout === 'string') router.push({ name: options.logout })
      else router.push({ name: 'logout' })
    })
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
    Events.off('user-abilities-changed', redirect)
  })

  // Expose
  return {
    redirect,
    isInitialized,
    onReconnectError,
    onReconnect,
    onRateLimit
  }
}
