// A hook that logs service method before, after and error
export function log (hook) {
  let message = `${hook.type}: ${hook.path} - Method: ${hook.method}`

  if (hook.type === 'error') {
    message += `: ${hook.error.message}`
  }

  if (hook.error) {
    hook.app.logger.error(message, hook.error.stack)
  } else {
    hook.app.logger.debug(message)
  }

  hook.app.logger.silly('hook.data', hook.data)
  hook.app.logger.silly('hook.params', hook.params)

  if (hook.result) {
    hook.app.logger.silly('hook.result', hook.result)
  }
}
