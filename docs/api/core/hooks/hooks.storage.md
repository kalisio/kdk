# Storage hooks

## Overview

Hooks for managing file attachments stored in the [storage service](../services/storage.md).

## Functions

### `removeAttachments(attachmentField)`

> To be used as an `after remove` hook. Returns a hook function.

Removes all S3 objects (and their thumbnails) referenced by a resource's attachment field when the resource is deleted.

- `attachmentField` *(string)*: Lodash path to the attachment or array of attachments on the hook result.

For each attachment the hook reads the object key from `attachment.key` (with fallback to `attachment._id` for backward compatibility) and calls `storageService.remove(key)` and `storageService.remove(key + '.thumbnail')`.

Requires a valid storage service in the same service context. Throws if none is found.
