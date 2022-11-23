import _ from 'lodash'
import { populateObject, unpopulateObject } from './hooks.query.js'
import makeDebug from 'debug'

const debug = makeDebug('kdk:core:storage:hooks')

export function removeAttachments (attachmentField) {
  return async function (hook) {
    const context = hook.service.context
    const storageService = hook.app.getService('storage', context)
    if (!storageService) return Promise.reject(new Error('No valid context found to retrieve storage service for initiator service ' + hook.service.name))
    const resource = hook.result
    const attachments = _.get(resource, attachmentField)
    // Process with each attachment
    if (attachments) {
      debug('Removing attachments for resource ' + resource._id.toString(), attachments)
      if (Array.isArray(attachments)) {
        const removePromises = []
        attachments.forEach(attachment => {
          // Backward compatibility as attachment key was previously stored under _id
          const id = _.get(attachment, 'key', _.get(attachment, '_id'))
          removePromises.push(storageService.remove(id))
          // Thumbnail as well
          removePromises.push(storageService.remove(id + '.thumbnail'))
        })
        await Promise.all(removePromises)
      } else {
        // Backward compatibility as attachment key was previously stored under _id
        const id = _.get(attachments, 'key', _.get(attachment, '_id'))
        await storageService.remove(id)
        // Thumbnail as well
        await storageService.remove(id + '.thumbnail')
      }
    }
    return hook
  }
}
