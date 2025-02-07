import { api } from '../api.js'

export function useMessages () {
  const messagesService = api.getService('messages')

  // Functions
  async function createMessage (message, query) {
    return messagesService.create(message, { query })
  }

  // Expose
  return {
    createMessage
  }
}
