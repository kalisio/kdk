import _ from 'lodash'
import logger from 'loglevel'
import { watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { Events } from '../events.js'
import { i18n } from '../i18n.js'

export function useErrors () {
  // Data
  const $q = useQuasar()
  const Route = useRoute()

  // Functions
  function showError (error) {
    // Check if this error is a quiet one or not
    if (error.ignore) {
      // In this case simply log
      logger.error(error)
      return
    }
    const notification = { type: 'negative', message: error.message || error.error_message || error.error, html: true }
    // Check if user can retry to avoid this error
    if (error.retryHandler) {
      notification.actions = [{
        label: this.$t('RETRY'),
        handler: error.retryHandler
      }]
      // Increase timeout so that user has a chance to retry
      notification.timeout = 20000
    }
    $q.notify(notification)
  }
  function showRouteError (route) {
    // We handle error on any page with query string
    if (route.query && (route.query.error_message || route.query.error)) {
      showError(route.query)
    }
    // OAuth login is using token set as route param like 'access_token=jwt'.
    // However in case of error it will be like 'error=message' instead.
    else if (route.params && route.params.token && route.params.token.startsWith('error=')) {
      showError({ message: route.params.token.split('=')[1] })
    }
  }

  // Watch
  watch(Route, (to, from) => showRouteError(to))

  // Hooks
  onMounted(() => {
    showRouteError(Route)
    Events.on('error-hook', hook => {
      // Forward to global error handler if not a "normal" error, ie an expired token
      if (_.get(hook.error, 'data.name') !== 'TokenExpiredError') {
        Events.emit('error', hook.error)
      }
    })
    Events.on('error', error => {
      // Translate the message if a translation key exists
      const translation = _.get(error, 'data.translation')
      if (translation) {
        error.message = i18n.tie('errors.' + translation.key, translation.params)
        if (translation.keys) {
          translation.keys.forEach(key => {
            error.message += '<br/>' + i18n.tie('errors.' + key, translation.params)
          })
        }
      } else {
        // Overwrite the message using error code
        if (error.code) {
          error.message = i18n.tie('errors.' + error.code)
        }
      }
      showError(error)
    })
  })

  // Expose
  return {
    showError,
    showRouteError
  }
}