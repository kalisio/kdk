export async function checkUnique (hook) {
  const accountService = hook.app.getService('account')
  try {
    await accountService.create({
      action: 'checkUnique',
      value: { email: hook.data.email }
    }, {
      // As we manage error we make this call transparent from the client perspective
      // This will avoid displaying an error message twice
      'skip-before-event': true,
      'skip-after-event': true,
      'skip-error-event': true
    })
  } catch (error) {
    // BadRequest is thrown when the user already exists, use a more specific message in this case
    if (error.code === 400) {
      error.data.translation = { key: 'EMAIL_ALREADY_TAKEN' }
    }
    throw error
  }
  return hook
}
