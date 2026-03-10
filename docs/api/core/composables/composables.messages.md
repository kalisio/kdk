# Messages

## Overview

`useMessages()` provides a thin wrapper around the KDK `messages` service for creating messages.

## Usage

```javascript
import { useMessages } from '@kalisio/kdk/core.client'

const { createMessage } = useMessages()
await createMessage({ body: 'Hello', recipients: ['userId'] })
```

## Exposed

| Name | Type | Description |
|------|------|-------------|
| `createMessage(message, query?)` | `async Function` | Creates a new message via the `messages` FeathersJS service. `message` is the message data object; `query` is an optional query object passed alongside the request. Returns the created message. |
