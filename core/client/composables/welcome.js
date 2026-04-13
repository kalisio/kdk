import { api } from '../api.js'
import { onBeforeUnmount } from 'vue'
import { useQuasar } from 'quasar'
import KWelcomePrompt from '../components/prompt/KWelcomePrompt.vue'
import _ from 'lodash'
import config from 'config'
import { LocalStorage } from '../web-storage.js'

export function useWelcome () {
  let welcome = null
  const $q = useQuasar()
  const webStorageKey = 'welcome-prompt'
  // Backward compatibility
  const previousWebStorageKey = 'welcome'

  function show () {
    const canShow = LocalStorage.get(webStorageKey, LocalStorage.get(previousWebStorageKey, false))
    // Introduction is only for logged users
    if (!(_.isNil(canShow) ? _.get(config, 'layout.welcome', true) : canShow)) return
    welcome = $q.dialog({
      component: KWelcomePrompt
    }).onCancel(() => hide())
  }
  function hide () {
    welcome = null
  }

  api.on('login', show)
  api.on('logout', hide)

  onBeforeUnmount(() => {
    api.off('login', show)
    api.off('logout', hide)
  })
}
