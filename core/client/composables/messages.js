import { api } from '../api.js'

export function useMessages (contextId) {
  const messagesService = api.getService('messages', contextId)

  // Functions
  async function createMessage (message, query) {
    return messagesService.create(message, { query })
  }

  // Expose
  return {
    createMessage
  }
}
