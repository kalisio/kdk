import _ from 'lodash'
import { populateObject, unpopulateObject } from './hooks.query'
import makeDebug from 'debug'

const debug = makeDebug('kdk:core:storage:hooks')

function isAttachmentEqual (file1, file2) {
  return file1._id === file2._id
}

export function populateAttachmentResource (hook) {
  if (hook.type !== 'before') {
    throw new Error('The \'populateStorageResource\' hook should only be used as a \'before\' hook.')
  }

  // Avoid populating any target resource when resource parameters are not present
  return populateObject({ serviceField: 'resourcesService', idField: 'resource', throwOnNotFound: false })(hook)
}

export function unpopulateAttachmentResource (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'unpopulateAttachmentResource\' hook should only be used as a \'after\' hook.')
  }

  return unpopulateObject({ serviceField: 'resourcesService', idField: 'resource' })(hook)
}

export async function attachToResource (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'attachToResource\' hook should only be used as a \'after\' hook.')
  }
  const data = hook.data
  const params = hook.params
  const query = params.query
  const file = hook.result
  const attachmentField = _.get(data, 'field') || _.get(query, 'field') || 'attachments'
  // By default attachments are stored in an array
  let isArray = _.get(data, 'isArray') || _.get(query, 'isArray') || true
  // Take care that because file uploads might be submitted by external multipart form data middlewares
  // all parameters types might be string
  if (typeof (isArray) !== 'boolean') {
    isArray = (isArray === 'true')
  }
  const context = hook.service.context
  const resourcesService = params.resourcesService
  const resource = params.resource
  let attachments = _.get(resource, attachmentField)
  const attachment = Object.assign({ _id: file._id }, _.omit(file, ['uri']))
  // Add context because attachments might come from different ones on the same target object
  if (context) {
    attachment.context = (typeof context === 'object' ? context._id.toString() : context.toString())
  }
  if (isArray) {
    // Initialize on first attachment
    if (!attachments) attachments = []
    attachments.push(attachment)
  } else {
    attachments = attachment
  }

  await resourcesService.patch(resource._id.toString(), {
    [attachmentField]: attachments
  }, {
    user: params.user,
    // Forward query so that any update param could be processed as usual on resource
    // Delete own parameters from query otherwise it will be used to filter items
    query: _.omit(query, ['resource', 'resourcesService'])
  })
  debug('Attached file on resource ' + resource._id.toString(), attachment)
  return hook
}

export async function detachFromResource (hook) {
  if (hook.type !== 'after') {
    throw new Error('The \'detachFromResource\' hook should only be used as a \'after\' hook.')
  }

  const params = hook.params
  const query = params.query
  const file = hook.result
  const attachmentField = _.get(query, 'field') || 'attachments'
  const resourcesService = params.resourcesService
  const resource = params.resource
  let attachments = _.get(resource, attachmentField)
  let attachment
  // List of attachments
  if (Array.isArray(attachments)) {
    const attachmentIndex = _.findIndex(attachments, attachment => isAttachmentEqual(attachment, file))
    if (attachmentIndex >= 0) {
      // Keep track of it for logging
      attachment = attachments[attachmentIndex]
      _.pullAt(attachments, attachmentIndex)
    }
  } else {
    // Single attachment object
    attachment = attachments
    attachments = null
  }

  await resourcesService.patch(resource._id.toString(), {
    [attachmentField]: attachments
  }, {
    user: params.user,
    // Forward query so that any update param could be processed as usual on resource
    // Delete own parameters from query otherwise it will be used to filter items
    query: _.omit(query, ['resource', 'resourcesService'])
  })
  debug('Detached file on resource ' + resource._id.toString(), attachment)
  return hook
}

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
          removePromises.push(storageService.remove(attachment._id))
          // Thumbnail as well
          removePromises.push(storageService.remove(attachment._id + '.thumbnail'))
        })
        await Promise.all(removePromises)
      } else {
        await storageService.remove(attachments._id)
        // Thumbnail as well
        await storageService.remove(attachments._id + '.thumbnail')
      }
    }
    return hook
  }
}
