import { api } from '../api.js'

export function useMessages (contextId) {
  const messagesService = api.getService('messages', contextId)

  // Functions
  async function createMessage (message) {
    return messagesService.create(message)
  }

  // Expose
  return {
    createMessage
  }
}
